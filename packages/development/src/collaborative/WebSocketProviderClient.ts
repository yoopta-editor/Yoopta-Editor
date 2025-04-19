import { applyAwarenessUpdate, Awareness, encodeAwarenessUpdate } from 'y-protocols/awareness';
import * as Y from 'yjs';

type WebSocketMessage = {
  type: 'sync' | 'update' | 'awareness' | 'auth' | 'query-awareness';
  documentName: string;
  state?: number[];
  update?: number[];
  awareness?: number[];
  auth?: {
    token: string;
  };
};

export type WebSocketProviderClientOptions = {
  url: string;
  documentName: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

export class WebSocketProviderClient {
  private socket: WebSocket | null = null;
  private ydoc: Y.Doc;
  private awarenessInstance: Awareness;
  private documentName: string;
  private url: string;

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private shouldReconnect = false;

  private isConnected = false;
  private isPermanentlyClosed = false;

  private onConnectCallback?: () => void;
  private onDisconnectCallback?: () => void;

  constructor(options: WebSocketProviderClientOptions) {
    this.documentName = options.documentName;
    this.ydoc = new Y.Doc();
    this.awarenessInstance = new Awareness(this.ydoc);
    this.url = options.url;

    this.onConnectCallback = options.onConnect;
    this.onDisconnectCallback = options.onDisconnect;

    this.awarenessInstance.on('change', this.handleAwarenessChange);

    this.ydoc.on('update', (update: Uint8Array, origin: any) => {
      if (origin !== 'REMOTE') {
        this.sendUpdate(update);
      }
    });
  }

  private handleAwarenessChange = ({ added, updated, removed }: any) => {
    const changedClients = [...added, ...updated, ...removed];
    const awarenessUpdate = encodeAwarenessUpdate(this.awarenessInstance, changedClients);

    console.log('WebSocketProviderClient CHANGES FIRED:', { added, updated, removed });

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('Attempting to send awareness update while socket is not open');
      return;
    }

    this.socket?.send(
      JSON.stringify({
        type: 'awareness',
        documentName: this.documentName,
        update: Array.from(awarenessUpdate),
      }),
    );
  };

  connect() {
    if (this.isPermanentlyClosed) {
      throw new Error('WebSocket permanently closed. Create a new provider instance.');
    }

    this.shouldReconnect = true;
    this.establishConnection();
  }

  private buildUrl(): string {
    const url = new URL(this.url);
    url.searchParams.set('document', this.documentName);
    return url.toString();
  }

  private establishConnection() {
    try {
      this.socket = new WebSocket(this.buildUrl());

      this.socket.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.reconnectTimeout = 1000;

        // const initialState = Y.encodeStateAsUpdate(this.ydoc);
        this.sendMessage({
          type: 'sync',
          documentName: this.documentName,
          // state: Array.from(initialState),
        });

        this.onConnectCallback?.();
      };

      this.socket.onmessage = this.handleMessage;

      this.socket.onclose = (event) => {
        this.isConnected = false;
        this.onDisconnectCallback?.();

        if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            this.reconnectTimeout *= 2;
            this.establishConnection();
          }, this.reconnectTimeout);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      throw error;
    }
  }

  private handleMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data) as WebSocketMessage;

      switch (data.type) {
        case 'sync':
          if (data.state) {
            const stateUpdate = new Uint8Array(data.state);
            Y.applyUpdate(this.ydoc, stateUpdate, 'REMOTE');
          }
          break;

        case 'update':
          if (data.update) {
            const updateData = new Uint8Array(data.update);
            Y.applyUpdate(this.ydoc, updateData, 'REMOTE');
          }
          break;

        case 'awareness':
          if (data.awareness) {
            console.log('WebSocketProviderClient eceived awareness update:', data.awareness);

            const awarenessUpdate = new Uint8Array(data.awareness);
            applyAwarenessUpdate(this.awarenessInstance, awarenessUpdate, 'REMOTE');
          }
          break;

        default:
          console.warn('Unknown message type:', data);
      }
    } catch (error) {
      console.error('Failed to process message:', error);
    }
  };

  public isOnline(): boolean {
    return this.isConnected;
  }

  public getStats() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      documentName: this.documentName,
    };
  }

  public forceSync() {
    if (this.isConnected) {
      const state = Y.encodeStateAsUpdate(this.ydoc);
      this.sendUpdate(state);
    }
  }

  public disconnect() {
    this.shouldReconnect = false;
    this.isPermanentlyClosed = true;

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.awarenessInstance.destroy();
    this.ydoc.destroy();

    this.onConnectCallback = undefined;
    this.onDisconnectCallback = undefined;
  }

  private sendMessage(message: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('Attempting to send message while socket is not open');
      return false;
    }

    try {
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  sendUpdate(update: Uint8Array) {
    return this.sendMessage({
      type: 'update',
      documentName: this.documentName,
      update: Array.from(update),
    });
  }

  get awareness() {
    return this.awarenessInstance;
  }

  get document() {
    return this.ydoc;
  }
}
