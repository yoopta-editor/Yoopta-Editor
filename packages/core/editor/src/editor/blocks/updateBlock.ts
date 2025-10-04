import type { YooptaOperation } from '../core/applyTransforms';
import type { SlateElement, YooEditor, YooptaBlockData } from '../types';

// Maybe add source pararmeter to this function?
export function updateBlock(
  editor: YooEditor,
  blockId: string,
  newData: Omit<Partial<YooptaBlockData>, 'id' | 'type'>,
): void {
  const block = editor.children[blockId];

  if (!block) {
    console.warn(`Block with id ${blockId} does not exist.`);
    return;
  }

  const updateBlockMetaOperation: YooptaOperation = {
    type: 'set_block_meta',
    id: blockId,
    properties: {},
    prevProperties: {},
  };

  const updateBlockValueOperation: YooptaOperation = {
    type: 'set_block_value',
    id: blockId,
    value: [],
  };

  if (newData.meta) {
    updateBlockMetaOperation.prevProperties = block.meta;
    updateBlockMetaOperation.properties = { ...block.meta, ...newData.meta };
  }

  if (newData.value) {
    updateBlockValueOperation.value = newData.value as SlateElement[];
  }

  const operations: YooptaOperation[] = [];

  if (Object.keys(updateBlockMetaOperation.properties).length) {
    operations.push(updateBlockMetaOperation);
  }

  if (updateBlockValueOperation.value.length) {
    operations.push(updateBlockValueOperation);
  }

  if (operations.length > 0) {
    editor.applyTransforms(operations, { validatePaths: false });
  }
}
