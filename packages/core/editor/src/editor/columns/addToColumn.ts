import type { YooptaOperation } from '../core/applyTransforms';
import type { YooEditor } from '../types';
import { getColumnGroupBlocks } from './getColumnGroupBlocks';

export type AddToColumnOptions = {
  blockId: string;
  columnGroup: string;
  columnIndex: number;
};

/**
 * Move a block into a column group at the specified column index.
 * The block will be placed after existing blocks in that column.
 */
export function addToColumn(editor: YooEditor, options: AddToColumnOptions): void {
  const { blockId, columnGroup, columnIndex } = options;

  const block = editor.children[blockId];
  if (!block) {
    console.warn(`Block ${blockId} not found`);
    return;
  }

  const groupBlocks = getColumnGroupBlocks(editor, columnGroup);
  if (groupBlocks.length === 0) {
    console.warn(`Column group ${columnGroup} not found`);
    return;
  }

  // Determine width from existing blocks in the group
  const existingWidth = groupBlocks[0]?.meta.columnWidth;

  const operations: YooptaOperation[] = [];

  operations.push({
    type: 'set_block_meta',
    id: blockId,
    properties: {
      columnGroup,
      columnIndex,
      columnWidth: existingWidth,
    },
    prevProperties: {
      columnGroup: block.meta.columnGroup,
      columnIndex: block.meta.columnIndex,
      columnWidth: block.meta.columnWidth,
    },
  });

  editor.batchOperations(() => {
    editor.applyTransforms(operations);
  });
}
