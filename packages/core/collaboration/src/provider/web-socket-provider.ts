import * as decoding from 'lib0/decoding';
import * as encoding from 'lib0/encoding';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as syncProtocol from 'y-protocols/sync';
import type * as Y from 'yjs';

const MSG_SYNC = 0;
const MSG_AWARENESS = 1;
const MSG_AUTH = 2;

type EventHandler = (...args: any[]) => void;

export class WebSocketProvider {
  awareness: awarenessProtocol.Awareness;

  private ws: WebSocket | null = null;
  private doc: Y.Doc;
  private url: string;
  private roomId: string;
  private token?: string;
  private shouldConnect = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private listeners = new Map<string, Set<EventHandler>>();

  constructor(url: string, roomId: string, doc: Y.Doc, options?: { token?: string }) {
    this.url = url;
    this.roomId = roomId;
    this.doc = doc;
    this.token = options?.token;
    this.awareness = new awarenessProtocol.Awareness(doc);

    // Listen to doc updates to send to server
    this.doc.on('update', this.onDocUpdate);
    this.awareness.on('update', this.onAwarenessUpdate);
  }

  connect(): void {
    if (this.shouldConnect) return;
    this.shouldConnect = true;
    this.emit('status', 'connecting');
    this.setupWebSocket();
  }

  disconnect(): void {
    this.shouldConnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.emit('status', 'disconnected');
  }

  destroy(): void {
    // Unsubscribe listeners before disconnect so no stale events fire
    this.doc.off('update', this.onDocUpdate);
    this.awareness.off('update', this.onAwarenessUpdate);
    this.disconnect();
    this.listeners.clear();
  }

  private setupWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    const wsUrl = `${this.url}/${this.roomId}`;
    this.ws = new WebSocket(wsUrl);
    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = () => {
      this.reconnectDelay = 1000; // Reset backoff
      this.emit('status', 'connected');

      // Send auth token if provided
      if (this.token && this.ws) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MSG_AUTH);
        encoding.writeVarString(encoder, this.token);
        this.ws.send(encoding.toUint8Array(encoder));
      }

      // Initiate sync: send sync step 1
      if (this.ws) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MSG_SYNC);
        syncProtocol.writeSyncStep1(encoder, this.doc);
        this.ws.send(encoding.toUint8Array(encoder));
      }

      // Send current awareness state
      if (this.ws) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MSG_AWARENESS);
        encoding.writeVarUint8Array(
          encoder,
          awarenessProtocol.encodeAwarenessUpdate(
            this.awareness,
            [this.doc.clientID],
          ),
        );
        this.ws.send(encoding.toUint8Array(encoder));
      }
    };

    this.ws.onmessage = (event: MessageEvent) => {
      const data = new Uint8Array(event.data as ArrayBuffer);
      const decoder = decoding.createDecoder(data);
      const msgType = decoding.readVarUint(decoder);

      switch (msgType) {
        case MSG_SYNC: {
          const encoder = encoding.createEncoder();
          encoding.writeVarUint(encoder, MSG_SYNC);

          const syncMessageType = syncProtocol.readSyncMessage(
            decoder,
            encoder,
            this.doc,
            'remote',
          );

          // If there's a response to send (e.g., sync step 2), send it
          if (encoding.length(encoder) > 1) {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              this.ws.send(encoding.toUint8Array(encoder));
            }
          }

          // After receiving sync step 2, we're synced
          if (syncMessageType === 1) {
            this.emit('synced', true);
          }

          break;
        }

        case MSG_AWARENESS: {
          awarenessProtocol.applyAwarenessUpdate(
            this.awareness,
            decoding.readVarUint8Array(decoder),
            'remote',
          );
          break;
        }

        case MSG_AUTH: {
          // Server auth response — could be accepted or rejected
          // For now, just log it
          break;
        }
        default: {
          break;
        }
      }

    };

    this.ws.onclose = () => {
      this.ws = null;
      if (this.shouldConnect) {
        this.emit('status', 'connecting');
        this.scheduleReconnect();
      } else {
        this.emit('status', 'disconnected');
      }
    };

    this.ws.onerror = () => {
      this.emit('status', 'error');
      // onclose will fire after onerror, which handles reconnection
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.shouldConnect) {
        this.setupWebSocket();
      }
    }, this.reconnectDelay);

    // Exponential backoff with cap
    this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, this.maxReconnectDelay);
  }

  // ---- Y.Doc & Awareness Handlers ----

  private onDocUpdate = (update: Uint8Array, origin: any): void => {
    // Don't send updates that came from the server
    if (origin === 'remote') return;
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MSG_SYNC);
    syncProtocol.writeUpdate(encoder, update);
    this.ws.send(encoding.toUint8Array(encoder));
  };

  private onAwarenessUpdate = ({ added, updated, removed }: {
    added: number[];
    updated: number[];
    removed: number[];
  }, origin: unknown): void => {
    // Only send locally-originated awareness changes to the server.
    // Remote awareness updates (origin === 'remote') are already on the server —
    // re-sending them creates a ping-pong loop between clients.
    if (origin === 'remote') return;
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const changedClients = [...added, ...updated, ...removed];
    if (changedClients.length === 0) return;

    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MSG_AWARENESS);
    encoding.writeVarUint8Array(
      encoder,
      awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients),
    );
    this.ws.send(encoding.toUint8Array(encoder));
  };

  // ---- Simple Event Emitter ----

  on(event: string, fn: EventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(fn);
  }

  off(event: string, fn: EventHandler): void {
    this.listeners.get(event)?.delete(fn);
  }

  emit(event: string, ...args: any[]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        handler(...args);
      }
    }
  }
}
