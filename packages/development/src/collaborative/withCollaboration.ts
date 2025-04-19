import * as Y from 'yjs';
import { YooEditor, YooptaOperation } from '@yoopta/editor';
import BlockOrderResolver from './conflict-resolver';

const LOCAL_ORIGIN = Symbol('yoopta-local-change');
const CONNECTED: WeakSet<YjsYooEditor> = new WeakSet();

const orderResolver = new BlockOrderResolver();

export type EditorState = {
  operations: YooptaOperation[];
  timestamp: number;
};

export type YjsYooEditor = YooEditor & {
  sharedState: Y.Map<EditorState>;
  localOrigin: symbol;
  isLocalOrigin: (origin: symbol) => boolean;
  applyRemoteEvents: (events: any[], origin: symbol) => void;
  connect: () => void;
  disconnect: () => void;
};

export const withCollaboration = (editor: YjsYooEditor, sharedState: Y.Map<EditorState>) => {
  const { applyTransforms } = editor;

  editor.sharedState = sharedState;
  editor.localOrigin = LOCAL_ORIGIN;
  editor.isLocalOrigin = (origin) => origin === editor.localOrigin;

  function handleYEvents(event: Y.YMapEvent<EditorState>, transaction: Y.Transaction) {
    if (editor.isLocalOrigin(transaction.origin)) return;

    const state = sharedState.get('state');
    if (!state) return;

    const remoteOperations = state.operations;
    const resolvedOperations = orderResolver.resolveConflicts(state, editor.children);

    if (remoteOperations.length > 0) {
      editor.withoutSavingHistory(() => {
        applyTransforms(remoteOperations, { validatePaths: true });
      });
    }
  }

  editor.connect = () => {
    if (CONNECTED.has(editor)) {
      console.warn('Editor already connected');
      return;
    }

    editor.sharedState.observe(handleYEvents);
    CONNECTED.add(editor);

    const state = editor.sharedState.get('state');
    if (state && Array.isArray(state.operations)) {
      const ops = state.operations.filter(
        (op) => !!op?.type && op.type !== 'set_path' && op.type !== 'set_block_value',
      );
      if (ops.length > 0) {
        editor.withoutSavingHistory(() => {
          applyTransforms(ops, { validatePaths: true });
        });
      }
    }
  };

  editor.disconnect = () => {
    editor.sharedState.unobserve(handleYEvents);
    CONNECTED.delete(editor);
  };

  editor.applyTransforms = (operations: YooptaOperation[], options?: any) => {
    applyTransforms(operations, { ...options, validatePaths: true });

    const ops = operations.filter((op) => !!op?.type && op.type !== 'set_path' && op.type !== 'set_block_value');
    if (ops.length > 0) {
      // debounce(() => {
      editor.sharedState.doc?.transact(() => {
        editor.sharedState.set('state', {
          operations: ops,
          timestamp: Date.now(),
        });
      }, editor.localOrigin);
      // }, 100);
    }
  };

  return editor;
};
