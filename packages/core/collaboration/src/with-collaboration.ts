import type { YooEditor } from '@yoopta/editor';
import * as Y from 'yjs';

import { AwarenessManager } from './awareness/awareness-manager';
import { createCursorDecorator, createCursorLeafRenderer } from './awareness/cursor-decorations';
import { YDocBinding } from './binding/y-doc-binding';
import { WebSocketProvider } from './provider/web-socket-provider';
import type {
  CollaborationConfig,
  CollaborationState,
  CollaborationYooEditor,
  ConnectionError,
  ConnectionStatus,
} from './types';

type CollaborationEmit = (event: string, payload: unknown) => void;

export function withCollaboration(
  editor: YooEditor,
  config: CollaborationConfig,
): CollaborationYooEditor {
  const collabEditor = editor as CollaborationYooEditor;

  const doc = config.document ?? new Y.Doc();

  const provider = new WebSocketProvider(config.url, config.roomId, doc, {
    token: config.token,
  });

  const awareness = new AwarenessManager(provider, config.user, editor);

  const binding = new YDocBinding(editor, doc);

  const emit = editor.emit as CollaborationEmit;

  let state: CollaborationState = {
    status: 'disconnected',
    connectedUsers: [config.user],
    document: doc,
    isSynced: false,
    error: null,
  };

  function updateState(partial: Partial<CollaborationState>): void {
    state = { ...state, ...partial };
    emit('collaboration:state-change', state);
  }

  provider.on('status', (status: ConnectionStatus) => {
    const patch: Partial<CollaborationState> = { status };
    if (status === 'connected') {
      patch.error = null;
    }
    updateState(patch);
    emit('collaboration:status-change', { status });
  });

  provider.on('connection-error', (error: ConnectionError) => {
    updateState({ error });
    emit('collaboration:connection-error', error);
  });

  provider.on('synced', () => {
    updateState({ isSynced: true });

    // After initial sync, load Y.Doc state if it has content
    // or seed from initialValue if Y.Doc is empty
    binding.initialSync(config.initialValue);
  });

  // Register leaf renderer once (stateless)
  const cursorLeafRenderer = createCursorLeafRenderer();
  editor.leafDecorators.set('remote-cursors', cursorLeafRenderer);

  // Listen to awareness changes for connected users
  awareness.onChange(() => {
    const users = awareness.getConnectedUsers();
    updateState({ connectedUsers: users });

    const cursors = awareness.getRemoteCursors();
    emit('collaboration:cursors-change', cursors);

    // Update cursor decorator with latest cursor positions
    const cursorDecorator = createCursorDecorator(cursors);
    editor.decorators.set('remote-cursors', cursorDecorator);
    emit('decorations:change', undefined);
  });

  const originalApplyTransforms = editor.applyTransforms;
  const originalIsRemoteSlateOp = editor.isRemoteSlateOp;
  const originalUndo = editor.undo;
  const originalRedo = editor.redo;

  editor.applyTransforms = (ops, options) => {
    // Apply locally first
    originalApplyTransforms(ops, options);

    if (!binding.isApplyingRemote) {
      binding.pushLocalOperations(ops);
    }

    // Reconcile per-block content bindings after every transform
    // (handles new/deleted/changed blocks)
    binding.reconcileContentBindings();
  };

  // Wire up isRemoteSlateOp so hooks.ts can skip history for remote changes
  editor.isRemoteSlateOp = (slate) => binding.isRemoteForSlate(slate);

  // Override undo/redo to use Y.UndoManager (only undoes local changes)
  editor.undo = () => {
    binding.undo();
  };
  editor.redo = () => {
    binding.redo();
  };

  const pathChangeHandler = (path: { current: number | null; selected?: number[] | null }) => {
    if (binding.isApplyingRemote) return;

    const selectedBlocks = path.selected && path.selected.length > 0 ? path.selected : null;

    if (path.current !== null) {
      const blocks = Object.values(editor.children);
      const block = blocks.find((b) => b.meta.order === path.current);

      if (block) {
        const slate = editor.blockEditorsMap[block.id];
        awareness.updateCursor(
          block.id,
          slate?.selection ?? null,
          selectedBlocks,
        );
      }
    } else if (selectedBlocks) {
      awareness.updateCursor(null, null, selectedBlocks);
    } else {
      awareness.updateCursor(null, null);
    }
  };

  editor.on('path-change', pathChangeHandler);

  collabEditor.collaboration = {
    get state() {
      return state;
    },

    setToken: (token: string) => {
      provider.setToken(token);
    },

    connect: () => {
      provider.connect();
    },

    disconnect: () => {
      provider.disconnect();
      updateState({ status: 'disconnected', isSynced: false });
    },

    destroy: () => {
      editor.off('path-change', pathChangeHandler);
      editor.decorators.delete('remote-cursors');
      editor.leafDecorators.delete('remote-cursors');
      emit('decorations:change', undefined);

      awareness.destroy();

      binding.destroy();
      provider.destroy();

      editor.applyTransforms = originalApplyTransforms;
      editor.isRemoteSlateOp = originalIsRemoteSlateOp;
      editor.undo = originalUndo;
      editor.redo = originalRedo;

      updateState({ status: 'disconnected', isSynced: false, connectedUsers: [] });
    },

    getDocument: () => doc,
  };

  if (config.connect === true) {
    provider.connect();
  }

  return collabEditor;
}
