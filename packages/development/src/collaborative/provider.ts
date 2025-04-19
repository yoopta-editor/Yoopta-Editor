import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';

export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
}

export interface CreateProviderOptions {
  documentName: string;
  serverUrl?: string;
  user: CollaborationUser;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onStatus?: (status: string) => void;
  onCursors?: (cursors: any[]) => void;
}

export interface YooptaCollaborationProvider {
  provider: HocuspocusProvider;
  doc: Y.Doc;
  blocks: Y.Map<any>;
  destroy: () => void;
}

export const createCollaborationProvider = (options: CreateProviderOptions): YooptaCollaborationProvider => {
  const doc = new Y.Doc();
  const blocks = doc.getMap('blocks');

  const provider = new HocuspocusProvider({
    url: options.serverUrl || 'ws://localhost:1234',
    name: options.documentName,
    document: doc,
    token: undefined, // в production here should be a token
    parameters: {
      userId: options.user.id,
      userName: options.user.name,
      userColor: options.user.color,
    },
    onAwarenessUpdate: ({ states }) => {
      const cursors = Array.from(states.entries())
        .map(([clientId, state]: [number, any]) => ({
          clientId,
          user: state.user,
          cursor: state.selection,
        }))
        .filter(({ clientId }) => clientId !== provider.awareness.clientID);

      options.onCursors?.(cursors);
    },
    onConnect: () => {
      console.log('Connected to server');
      options.onConnect?.();
    },
    onDisconnect: () => {
      console.log('Disconnected from server');
      options.onDisconnect?.();
    },
    onStatus: ({ status }) => {
      options.onStatus?.(status);
    },
  });

  return {
    provider,
    doc,
    blocks,
    destroy: () => {
      provider.destroy();
      doc.destroy();
    },
  };
};
