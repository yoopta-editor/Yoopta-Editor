import { Operation } from 'slate';
import { SlateElement, YooEditor, YooptaPath } from '../types';
import { YooptaOperation } from './applyTransforms';
import { Blocks } from '../blocks';

export type HistoryStack = {
  operations: YooptaOperation[];
  path: YooptaPath;
};

export type HistoryStackName = 'undos' | 'redos';

export function inverseEditorOperation(editor: YooEditor, op: YooptaOperation): YooptaOperation | YooptaOperation[] {
  switch (op.type) {
    case 'insert_block':
      return {
        type: 'delete_block',
        path: op.path,
        block: op.block,
      };

    case 'delete_block':
      return {
        type: 'insert_block',
        path: op.path,
        block: op.block,
      };

    case 'set_block_meta': {
      return {
        type: 'set_block_meta',
        id: op.id,
        properties: op.prevProperties,
        prevProperties: op.properties,
      };
    }

    case 'split_block': {
      return [
        {
          type: 'delete_block',
          block: op.properties.nextBlock,
          path: op.path,
        },
        {
          type: 'set_block_value',
          id: op.prevProperties.originalBlock.id,
          value: op.prevProperties.originalValue as SlateElement[],
          forceSlate: true,
        },
      ];
    }

    case 'merge_block': {
      return [
        {
          type: 'split_block',
          properties: {
            nextBlock: op.prevProperties.sourceBlock,
            nextSlateValue: op.prevProperties.sourceSlateValue,
            splitSlateValue: op.prevProperties.targetSlateValue,
          },
          prevProperties: {
            originalBlock: op.properties.mergedBlock,
            originalValue: op.properties.mergedSlateValue,
          },
          path: op.path,
        },
      ];
    }

    case 'move_block': {
      return {
        type: 'move_block',
        properties: op.prevProperties,
        prevProperties: op.properties,
      };
    }

    case 'set_slate': {
      const inverseOps = op.properties.slateOps.map(Operation.inverse).reverse();
      return {
        type: 'set_slate',
        properties: {
          slateOps: inverseOps,
          selectionBefore: op.properties.selectionBefore,
        },
        slate: op.slate,
        blockId: op.blockId,
      };
    }

    case 'set_editor_value': {
      return {
        type: 'set_editor_value',
        properties: op.prevProperties,
        prevProperties: op.properties,
      };
    }

    default:
      return op;
  }
}

export type UndoRedoOptions = {
  scroll?: boolean;
};

export const SAVING = new WeakMap<YooEditor, boolean | undefined>();
export const MERGING = new WeakMap<YooEditor, boolean | undefined>();

export const YooptaHistory = {
  isMergingHistory(editor: YooEditor): boolean | undefined {
    return MERGING.get(editor);
  },

  isSavingHistory(editor: YooEditor): boolean | undefined {
    return SAVING.get(editor);
  },

  withMergingHistory(editor: YooEditor, fn: () => void): void {
    const prev = YooptaHistory.isMergingHistory(editor);
    MERGING.set(editor, true);
    fn();
    MERGING.set(editor, prev);
  },

  withSavingHistory(editor: YooEditor, fn: () => void): void {
    const prev = YooptaHistory.isSavingHistory(editor);
    SAVING.set(editor, true);
    fn();
    SAVING.set(editor, prev);
  },

  withoutMergingHistory(editor: YooEditor, fn: () => void): void {
    const prev = YooptaHistory.isMergingHistory(editor);
    MERGING.set(editor, false);
    fn();
    MERGING.set(editor, prev);
  },

  withoutSavingHistory(editor: YooEditor, fn: () => void): void {
    const prev = YooptaHistory.isSavingHistory(editor);
    SAVING.set(editor, false);
    fn();
    SAVING.set(editor, prev);
  },

  redo: (editor: YooEditor, options?: UndoRedoOptions) => {
    const { redos } = editor.historyStack;

    if (redos.length > 0) {
      const batch = redos[redos.length - 1];

      YooptaHistory.withoutSavingHistory(editor, () => {
        editor.applyTransforms(batch.operations, { source: 'history' });
        editor.setPath(batch.path);

        const { scroll = true } = options || {};
        if (scroll && typeof batch.path.current === 'number') {
          const block = Blocks.getBlock(editor, { at: batch.path.current });

          // [TODO] - not good place to scroll. View tasks should be separated from model tasks
          const blockElement = document.querySelector(`[data-yoopta-block-id="${block?.id}"]`);
          if (blockElement && !isInViewport(blockElement)) {
            blockElement.scrollIntoView({ block: 'center', behavior: 'auto' });
          }
        }
      });

      editor.historyStack.redos.pop();
      editor.historyStack.undos.push(batch);
    }
  },
  undo: (editor: YooEditor, options?: UndoRedoOptions) => {
    const { undos } = editor.historyStack;

    if (undos.length > 0) {
      const batch = editor.historyStack.undos[editor.historyStack.undos.length - 1];

      YooptaHistory.withoutSavingHistory(editor, () => {
        // [TODO] - ask Christopher Nolan to help with this
        const inverseOps = batch.operations.flatMap((op) => inverseEditorOperation(editor, op)).reverse();
        editor.applyTransforms(inverseOps, { source: 'history' });
        editor.setPath(batch.path);

        const { scroll = true } = options || {};
        if (scroll && typeof batch.path.current === 'number') {
          const block = Blocks.getBlock(editor, { at: batch.path.current });

          // [TODO] - not good place to scroll. View tasks should be separated from model tasks
          const blockElement = document.querySelector(`[data-yoopta-block-id="${block?.id}"]`);
          if (blockElement && !isInViewport(blockElement)) {
            blockElement.scrollIntoView({ block: 'center', behavior: 'auto' });
          }
        }
      });

      editor.historyStack.redos.push(batch);
      editor.historyStack.undos.pop();
    }
  },
};

function isInViewport(element) {
  var rect = element.getBoundingClientRect();
  var html = document.documentElement;
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || html.clientHeight) &&
    rect.right <= (window.innerWidth || html.clientWidth)
  );
}
