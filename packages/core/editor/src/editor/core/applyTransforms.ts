import { createDraft, finishDraft, isDraft, produce } from 'immer';
import { buildSlateEditor } from '../../utils/buildSlate';
import { SlateEditor, SlateElement, YooEditor, YooptaBlockData, YooptaContentValue, YooptaPath } from '../types';
import { Editor, Operation, Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

export type ChangeSource = 'api' | 'user' | 'history';

export type SetSlateOperation = {
  type: 'set_slate';
  slate: SlateEditor;
  blockId: string;
  properties: {
    slateOps: Operation[];
    selectionBefore: Range | null;
  };
};

export type MoveBlockOperation = {
  type: 'move_block';
  prevProperties: {
    id: string;
    order: number;
  };
  properties: {
    id: string;
    order: number;
  };
};

export type InsertBlockOperation = {
  type: 'insert_block';
  path: YooptaPath;
  block: YooptaBlockData;
};

export type SetBlockValueOperation = {
  type: 'set_block_value';
  id: string;
  value: SlateElement[];
  forceSlate?: boolean;
};

export type SetBlockMetaOperation = {
  type: 'set_block_meta';
  id: string;
  properties: Omit<Partial<YooptaBlockData['meta']>, 'order'>;
  prevProperties: Omit<Partial<YooptaBlockData['meta']>, 'order'>;
};

export type SplitBlockOperation = {
  type: 'split_block';
  properties: {
    nextBlock: YooptaBlockData;
    splitSlateValue: SlateElement[];
    nextSlateValue: SlateElement[];
  };
  prevProperties: {
    originalBlock: YooptaBlockData;
    originalValue: SlateElement[];
  };
  path: YooptaPath;
};

export type ToogleBlockOperation = {
  type: 'toggle_block';
  properties: {
    toggledBlock: YooptaBlockData;
    toggledSlateValue: SlateElement[];
  };
  prevProperties: {
    sourceBlock: YooptaBlockData;
    sourceSlateValue: SlateElement[];
  };
};

export type MergeBlockOperation = {
  type: 'merge_block';
  properties: {
    mergedBlock: YooptaBlockData;
    mergedSlateValue: SlateElement[];
  };
  prevProperties: {
    sourceBlock: YooptaBlockData;
    sourceSlateValue: SlateElement[];
    targetBlock: YooptaBlockData;
    targetSlateValue: SlateElement[];
  };
  path: YooptaPath;
};

export type DeleteBlockOperation = {
  type: 'delete_block';
  path: YooptaPath;
  block: YooptaBlockData;
};

export type SetSelectionBlockOperation = {
  type: 'set_block_path';
  path: YooptaPath;
};

export type NormalizePathsBlockOperation = {
  type: 'validate_block_paths';
};

export type SetEditorValueOperation = {
  type: 'set_editor_value';
  properties: {
    value: YooptaContentValue;
  };
  prevProperties: {
    value: YooptaContentValue;
  };
};

export type YooptaOperation =
  | InsertBlockOperation
  | DeleteBlockOperation
  | NormalizePathsBlockOperation
  | SetSelectionBlockOperation
  | SplitBlockOperation
  | SetBlockValueOperation
  | SetBlockMetaOperation
  | MergeBlockOperation
  | ToogleBlockOperation
  | MoveBlockOperation
  | SetSlateOperation
  | SetEditorValueOperation;

function applyOperation(editor: YooEditor, op: YooptaOperation): void {
  switch (op.type) {
    case 'set_slate': {
      const { properties, blockId } = op;

      const slate = editor.blockEditorsMap[blockId];

      if (slate) {
        const { slateOps, selectionBefore } = properties;

        Editor.withoutNormalizing(slate, () => {
          for (const slateOp of slateOps) {
            slate.apply(slateOp);
          }

          if (selectionBefore) {
            try {
              Transforms.select(slate, selectionBefore);
              ReactEditor.focus(slate);
            } catch (error) {}
          }
        });
      }

      break;
    }

    case 'insert_block': {
      editor.blockEditorsMap[op.block.id] = buildSlateEditor(editor);
      editor.children[op.block.id] = op.block;
      editor.blockEditorsMap[op.block.id].children = op.block.value;

      Object.keys(editor.children).forEach((blockId) => {
        const existingBlock = editor.children[blockId];
        if (existingBlock.meta.order >= op.block.meta.order && existingBlock.id !== op.block.id) {
          if (isDraft(editor.children[existingBlock.id])) {
            existingBlock.meta.order = existingBlock.meta.order + 1;
          }
        }
      });

      break;
    }

    case 'delete_block': {
      delete editor.blockEditorsMap[op.block.id];
      delete editor.children[op.block.id];

      // if (Object.keys(editor.children).length === 0) {
      //   const id = generateId();
      //   const defaultBlock = buildBlockData({ id });
      //   editor.children[id] = defaultBlock;
      //   editor.blockEditorsMap[id] = buildSlateEditor(editor);
      // }

      const blocks = Object.values(editor.children);

      blocks.forEach((existingBlock) => {
        if (existingBlock.meta.order > op.block.meta.order) {
          if (isDraft(existingBlock)) {
            existingBlock.meta.order--;
          } else {
            produce(existingBlock, (draft) => {
              draft.meta.order--;
            });
          }
        }
      });

      blocks.sort((a, b) => a.meta.order - b.meta.order);
      blocks.forEach((block, index) => {
        if (!isDraft(block.meta)) {
          produce(block, (draft) => {
            draft.meta = { ...draft.meta, order: index };
          });
        } else {
          block.meta.order = index;
        }
      });

      break;
    }

    case 'set_block_value': {
      const { id, value, forceSlate } = op;
      const slate = editor.blockEditorsMap[id];

      if (forceSlate && slate) {
        slate.children = value;
      }

      if (Array.isArray(value)) {
        if (isDraft(editor.children[id])) {
          editor.children[id].value = value;
        } else {
          produce(editor.children[id], (draft) => {
            draft.value = value;
          });
        }
      }
      break;
    }

    case 'set_block_meta': {
      const { id, properties } = op;

      const block = editor.children[id];
      if (!block) break;

      if (isDraft(block)) {
        Object.keys(properties).forEach((key) => {
          block.meta[key] = properties[key];
        });
      } else {
        produce(block, (draft) => {
          draft.meta = { ...draft.meta, ...properties };
        });
      }

      break;
    }

    case 'split_block': {
      const { properties } = op;

      const nextSlate = buildSlateEditor(editor);
      nextSlate.children = properties.nextSlateValue;
      editor.children[properties.nextBlock.id] = { ...properties.nextBlock, value: nextSlate.children };
      editor.blockEditorsMap[properties.nextBlock.id] = nextSlate;

      const splitSlate = editor.blockEditorsMap[op.prevProperties.originalBlock.id];
      splitSlate.children = properties.splitSlateValue;
      editor.children[op.prevProperties.originalBlock.id].value = splitSlate.children;

      Object.values(editor.children).forEach((block) => {
        if (block.meta.order >= properties.nextBlock.meta.order && block.id !== properties.nextBlock.id) {
          if (isDraft(block)) {
            block.meta.order++;
          } else {
            produce(block, (draft) => {
              draft.meta.order++;
            });
          }
        }
      });
      break;
    }

    case 'merge_block': {
      const { prevProperties, properties } = op;

      delete editor.blockEditorsMap[prevProperties.sourceBlock.id];
      delete editor.children[prevProperties.sourceBlock.id];

      editor.children[properties.mergedBlock.id] = properties.mergedBlock;
      editor.blockEditorsMap[properties.mergedBlock.id].children = properties.mergedSlateValue;

      Object.values(editor.children).forEach((block) => {
        if (block.meta.order > properties.mergedBlock.meta.order) {
          if (isDraft(block)) {
            block.meta.order--;
          } else {
            produce(block, (draft) => {
              draft.meta.order--;
            });
          }
        }
      });
      break;
    }

    case 'toggle_block': {
      const { properties, prevProperties } = op;
      delete editor.blockEditorsMap[prevProperties.sourceBlock.id];
      delete editor.children[prevProperties.sourceBlock.id];

      const newSlate = buildSlateEditor(editor);
      newSlate.children = properties.toggledSlateValue;

      editor.children[properties.toggledBlock.id] = properties.toggledBlock;
      editor.blockEditorsMap[properties.toggledBlock.id] = newSlate;

      break;
    }

    case 'move_block': {
      const { prevProperties, properties } = op;
      const block = editor.children[prevProperties.id];

      if (block) {
        block.meta.order = properties.order;

        Object.values(editor.children).forEach((otherBlock) => {
          if (otherBlock.id !== prevProperties.id) {
            if (prevProperties.order < properties.order) {
              if (otherBlock.meta.order > prevProperties.order && otherBlock.meta.order <= properties.order) {
                otherBlock.meta.order--;
              }
            } else {
              if (otherBlock.meta.order < prevProperties.order && otherBlock.meta.order >= properties.order) {
                otherBlock.meta.order++;
              }
            }
          }
        });
      }

      break;
    }

    case 'set_block_path': {
      editor.path = op.path;
      break;
    }

    case 'set_editor_value': {
      editor.children = op.properties.value;

      const blockEditorsMap = {};

      Object.keys(editor.children).forEach((id) => {
        const block = editor.children[id];
        const slate = buildSlateEditor(editor);
        slate.children = block.value;

        blockEditorsMap[id] = slate;
      });

      editor.blockEditorsMap = blockEditorsMap;

      break;
    }

    case 'validate_block_paths': {
      const blocks = Object.values(editor.children);
      blocks.sort((a, b) => a.meta.order - b.meta.order);
      blocks.forEach((block, index) => {
        if (!isDraft(block.meta)) {
          produce(block, (draft) => {
            draft.meta = { ...draft.meta, order: index };
          });
        } else {
          block.meta.order = index;
        }
      });
      break;
    }
  }
}

export type ApplyTransformsOptions = {
  validatePaths?: boolean;
  source?: ChangeSource;
};

const MAX_HISTORY_LENGTH = 100;

export function applyTransforms(editor: YooEditor, ops: YooptaOperation[], options?: ApplyTransformsOptions): void {
  editor.children = createDraft(editor.children);
  editor.path = createDraft(editor.path);

  const { validatePaths = true, source } = options || {};
  const operations = [...ops];

  if (validatePaths) {
    operations.push({ type: 'validate_block_paths' });
  }

  if (operations.length > 1) {
    // if type is insert_block, we need to sort these operations by order
    operations.sort((a, b) => {
      if (a.type === 'insert_block' && b.type === 'insert_block') {
        return a.block.meta.order - b.block.meta.order;
      }

      return 0;
    });
  }

  for (const operation of operations) {
    // run `set_slate` operation only if source is history
    if (operation.type === 'set_slate' && source === 'api') {
      continue;
    }

    applyOperation(editor, operation);
  }

  if (!isDraft(editor.children)) editor.children = createDraft(editor.children);
  editor.children = finishDraft(editor.children);

  if (isDraft(editor.path)) {
    editor.path = finishDraft(editor.path);
  }

  const saveHistory = editor.isSavingHistory() !== false;
  if (saveHistory) {
    const historyBatch = {
      operations: operations.filter(
        (op) => op.type !== 'set_block_path' && op.type !== 'set_block_value' && op.type !== 'validate_block_paths',
      ),
      path: editor.path,
    };

    if (historyBatch.operations.length > 0 && source !== 'history') {
      editor.historyStack.undos.push(historyBatch);
      editor.historyStack.redos = [];
    }

    if (editor.historyStack.undos.length > MAX_HISTORY_LENGTH) {
      editor.historyStack.undos.shift();
    }
  }

  const changeOptions = { value: editor.children, operations };
  editor.emit('change', changeOptions);
  editor.emit('path-change', editor.path);

  if (process.env.NODE_ENV !== 'production') {
    assertValidPaths(editor);
  }
}

function assertValidPaths(editor: YooEditor) {
  const blocks = [...Object.values(editor.children)];
  blocks.sort((a, b) => a.meta.order - b.meta.order);
  blocks.forEach((block, index) => {
    if (block.meta.order !== index) {
      console.warn(
        `Block path inconsistency detected: Block ${block.id} has order ${block.meta.order}, expected ${index}`,
      );
    }
  });
}
