import * as Y from 'yjs';
import { YjsYooEditor } from './withCollaboration';

export type EditorWithYjsHistory = YjsYooEditor & {
  undo: () => void;
  redo: () => void;
  history: {
    clear: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
  };
  undoManager: Y.UndoManager;
};

export interface YjsHistoryOptions {
  captureTimeout?: number;
  trackedOrigins?: Set<any>;
  onStackItemAdded?: () => void;
  onStackItemPopped?: () => void;
}

export function withYjsHistory(editor: YjsYooEditor, options: YjsHistoryOptions = {}): EditorWithYjsHistory {
  const e = editor as EditorWithYjsHistory;

  const undoManager = new Y.UndoManager(e.sharedState, {
    trackedOrigins: options.trackedOrigins || new Set([e.localOrigin]),
    captureTimeout: options.captureTimeout || 500,
  });

  const handleStackItemAdded = () => {
    options.onStackItemAdded?.();
  };

  const handleStackItemPopped = (event: any) => {
    const currentState = e.sharedState.get('state');
    console.log('handleStackItemPopped currentState', currentState);
    if (currentState && currentState.operations) {
      e.withoutSavingHistory(() => {});
    }

    options.onStackItemPopped?.();
  };

  const handleStackItemUpdated = () => {};

  e.undo = () => {
    if (undoManager.canUndo()) {
      undoManager.undo();
    }
  };

  e.redo = () => {
    if (undoManager.canRedo()) {
      undoManager.redo();
    }
  };

  e.undoManager = undoManager;

  e.history = {
    clear: () => {
      undoManager.clear();
    },

    canUndo: () => undoManager.canUndo(),
    canRedo: () => undoManager.canRedo(),
  };

  const { connect, disconnect } = e;

  e.connect = () => {
    connect?.();

    e.undoManager.on('stack-item-added', handleStackItemAdded);
    e.undoManager.on('stack-item-popped', handleStackItemPopped);
    e.undoManager.on('stack-item-updated', handleStackItemUpdated);
  };

  e.disconnect = () => {
    e.undoManager.off('stack-item-added', handleStackItemAdded);
    e.undoManager.off('stack-item-popped', handleStackItemPopped);
    e.undoManager.off('stack-item-updated', handleStackItemUpdated);

    disconnect?.();
  };

  return e;
}
