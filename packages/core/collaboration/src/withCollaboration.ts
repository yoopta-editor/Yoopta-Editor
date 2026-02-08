import { YjsEditor, withYjs } from '@slate-yjs/core';
import type { SlateElement, YooEditor } from '@yoopta/editor';
import { buildSlateEditor } from '@yoopta/editor';
import * as Y from 'yjs';

import { AwarenessManager } from './awareness/AwarenessManager';
import { YDocBinding } from './binding/YDocBinding';
import { WebSocketProvider } from './provider/WebSocketProvider';
import type {
  CollaborationConfig,
  CollaborationState,
  CollaborationYooEditor,
  ConnectionStatus,
} from './types';

type CollaborationEmit = (event: string, payload: unknown) => void;

export function withCollaboration(
  editor: YooEditor,
  config: CollaborationConfig,
): CollaborationYooEditor {
  const collabEditor = editor as CollaborationYooEditor;

  // Create or use provided Y.Doc
  const doc = config.document ?? new Y.Doc();

  // Create provider
  const provider = new WebSocketProvider(config.url, config.roomId, doc, {
    token: config.token,
  });

  // Create awareness manager
  const awareness = new AwarenessManager(provider, config.user, editor);

  // Create binding
  const binding = new YDocBinding(editor, doc);

  // Cast emit to allow custom collaboration events
  const emit = editor.emit as CollaborationEmit;

  // ---- Collaborative Slate editor factory ----

  /**
   * Override the Slate editor factory so that every block's Slate editor
   * is wrapped with `withYjs`, binding it to the block's Y.XmlText.
   * slate-yjs handles all bidirectional Slate↔Yjs content sync automatically.
   */
  editor.buildSlateEditorFn = (blockId: string) => {
    const sharedRoot = binding.getSharedRoot(blockId);
    console.log('editor.buildSlateEditorFn sharedRoot', blockId, sharedRoot?.doc?.toJSON())
    if (sharedRoot) {
      const baseSlate = buildSlateEditor(editor);
      const slate = withYjs(baseSlate, sharedRoot, { autoConnect: false });
      YjsEditor.connect(slate);
      return slate;
    }
    // Fallback: no Y.XmlText yet (shouldn't happen in normal flow)
    return buildSlateEditor(editor);
  };

  /**
   * Check if a given Slate editor is currently applying a remote collaborative change.
   * Used by the useSlateEditor hook to skip Yoopta history tracking for remote ops.
   */
  editor.isRemoteSlateOp = (slate) => {
    try {
      const yjsSlate = slate as unknown as Parameters<typeof YjsEditor.connected>[0];
      console.log('withCollaboration.isRemoteSlateOp YjsEditor.isLocal(yjsSlate)', YjsEditor.isLocal(yjsSlate))
      return YjsEditor.connected(yjsSlate) && !YjsEditor.isLocal(yjsSlate);
    } catch {
      return false;
    }
  };

  // ---- State management ----

  let state: CollaborationState = {
    status: 'disconnected',
    connectedUsers: [config.user],
    document: doc,
    isSynced: false,
  };

  function updateState(partial: Partial<CollaborationState>): void {
    state = { ...state, ...partial };
    emit('collaboration:state-change', state);
  }

  // Listen to provider status
  provider.on('status', (status: ConnectionStatus) => {
    updateState({ status });
    emit('collaboration:status-change', { status });
  });

  provider.on('synced', () => {
    updateState({ isSynced: true });

    // After initial sync, load Y.Doc state if it has content
    // or seed from initialValue if Y.Doc is empty
    binding.initialSync(config.initialValue);
  });

  // Listen to awareness changes for connected users
  awareness.onChange(() => {
    const users = awareness.getConnectedUsers();
    updateState({ connectedUsers: users });

    const cursors = awareness.getRemoteCursors();
    emit('collaboration:cursors-change', cursors);
  });

  // ---- Intercept applyTransforms ----

  const originalApplyTransforms = editor.applyTransforms;

  editor.applyTransforms = (ops, options) => {
    // If this is a remote change being applied, just run the original — don't push back to Y.Doc
    if (binding.isApplyingRemote) {
      originalApplyTransforms(ops, options);
      return;
    }

    // Pre-process: ensure Y.XmlText entries exist for new blocks BEFORE applyTransforms runs,
    // so that buildSlateEditorFn can find them when creating Slate editors.
    for (const op of ops) {
      if (op.type === 'insert_block') {
        binding.ensureSharedRoot(op.block.id, op.block.value as SlateElement[]);
      } else if (op.type === 'split_block') {
        binding.ensureSharedRoot(
          op.properties.nextBlock.id,
          op.properties.nextSlateValue,
        );
      } else if (op.type === 'toggle_block') {
        binding.deleteSharedRoot(op.prevProperties.sourceBlock.id);
        binding.ensureSharedRoot(
          op.properties.toggledBlock.id,
          op.properties.toggledSlateValue,
        );
      }
    }

    console.log('editor.applyTransforms ops', ops)

    // Apply locally
    originalApplyTransforms(ops, options);

    // Push only structural operations to Y.Doc — content sync is handled by slate-yjs per block
    const structuralOps = ops.filter(
      (op) =>
        op.type !== 'set_slate' &&
        op.type !== 'set_block_value' &&
        op.type !== 'set_block_path' &&
        op.type !== 'validate_block_paths',
    );

    if (structuralOps.length > 0) {
      binding.pushLocalOperations(structuralOps);
    }
  };

  // ---- Listen to cursor/selection changes for awareness ----

  editor.on('path-change', (path) => {
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
      // Multi-block selection without a single active block
      awareness.updateCursor(null, null, selectedBlocks);
    } else {
      awareness.updateCursor(null, null);
    }
  });

  // ---- Public API ----

  collabEditor.collaboration = {
    get state() {
      return state;
    },

    connect: () => {
      provider.connect();
    },

    disconnect: () => {
      provider.disconnect();
      updateState({ status: 'disconnected', isSynced: false });
    },

    destroy: () => {
      // Disconnect all collaborative Slate editors
      for (const blockId of Object.keys(editor.blockEditorsMap)) {
        const slate = editor.blockEditorsMap[blockId] as unknown as Parameters<typeof YjsEditor.connected>[0];
        try {
          if (YjsEditor.connected(slate)) {
            YjsEditor.disconnect(slate);
          }
        } catch {
          // Editor may not be a YjsEditor — skip
        }
      }

      provider.disconnect();
      binding.destroy();
      awareness.destroy();
      provider.destroy();
      updateState({ status: 'disconnected', isSynced: false, connectedUsers: [] });
    },

    getDocument: () => doc,
  };

  // Auto-connect if not explicitly disabled
  if (config.connect !== false) {
    provider.connect();
  }

  return collabEditor;
}
