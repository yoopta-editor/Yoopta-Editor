import type { YooEditor } from '@yoopta/editor';
import * as awarenessProtocol from 'y-protocols/awareness';

import type { WebSocketProvider } from '../provider/WebSocketProvider';
import type { CollaborationUser, RemoteCursorData } from '../types';

export class AwarenessManager {
  private changeHandlers = new Set<() => void>();
  private awarenessChangeHandler: () => void;

  constructor(
    private provider: WebSocketProvider,
    private user: CollaborationUser,
    private editor: YooEditor,
  ) {
    // Set local user state
    this.provider.awareness.setLocalStateField('user', user);

    // Listen to awareness changes
    this.awarenessChangeHandler = () => {
      for (const handler of this.changeHandlers) {
        handler();
      }
    };
    this.provider.awareness.on('change', this.awarenessChangeHandler);
  }

  /** Update local cursor position */
  updateCursor(blockId: string | null, selection: any | null, selectedBlocks?: number[] | null): void {
    this.provider.awareness.setLocalStateField('cursor', {
      blockId,
      selection,
      selectedBlocks: selectedBlocks ?? null,
    });
  }

  /** Get all remote cursors (excludes local user) */
  getRemoteCursors(): RemoteCursorData[] {
    const states = this.provider.awareness.getStates();
    const localClientId = this.provider.awareness.doc.clientID;
    const cursors: RemoteCursorData[] = [];

    states.forEach((state, clientId) => {
      if (clientId === localClientId) return;
      if (!state.user) return;

      cursors.push({
        clientId,
        user: state.user as CollaborationUser,
        blockId: state.cursor?.blockId ?? null,
        selection: state.cursor?.selection ?? null,
        selectedBlocks: state.cursor?.selectedBlocks ?? null,
      });
    });

    return cursors;
  }

  /** Get all connected users (including local) */
  getConnectedUsers(): CollaborationUser[] {
    const states = this.provider.awareness.getStates();
    const users: CollaborationUser[] = [];

    states.forEach((state) => {
      if (state.user) {
        users.push(state.user as CollaborationUser);
      }
    });

    return users;
  }

  /** Register a callback for awareness changes */
  onChange(handler: () => void): void {
    this.changeHandlers.add(handler);
  }

  /** Unregister a callback */
  offChange(handler: () => void): void {
    this.changeHandlers.delete(handler);
  }

  destroy(): void {
    this.provider.awareness.off('change', this.awarenessChangeHandler);
    awarenessProtocol.removeAwarenessStates(
      this.provider.awareness,
      [this.provider.awareness.doc.clientID],
      null,
    );
    this.changeHandlers.clear();
  }
}
