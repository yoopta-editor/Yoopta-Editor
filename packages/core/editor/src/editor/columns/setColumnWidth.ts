import type { YooptaOperation } from '../core/applyTransforms';
import type { YooEditor } from '../types';
import { getColumnGroupBlocks } from './getColumnGroupBlocks';

export type SetColumnWidthOptions = {
  columnGroup: string;
  columnIndex: number;
  width: number;
};

/**
 * Update the width of a specific column in a group.
 * Sets the columnWidth on all blocks that share the given columnIndex.
 */
export function setColumnWidth(editor: YooEditor, options: SetColumnWidthOptions): void {
  const { columnGroup, columnIndex, width } = options;

  const groupBlocks = getColumnGroupBlocks(editor, columnGroup);
  const blocksInColumn = groupBlocks.filter((b) => b.meta.columnIndex === columnIndex);

  if (blocksInColumn.length === 0) {
    console.warn(`No blocks found in column ${columnIndex} of group ${columnGroup}`);
    return;
  }

  const operations: YooptaOperation[] = [];

  for (const block of blocksInColumn) {
    operations.push({
      type: 'set_block_meta',
      id: block.id,
      properties: {
        columnWidth: width,
      },
      prevProperties: {
        columnWidth: block.meta.columnWidth,
      },
    });
  }

  editor.batchOperations(() => {
    editor.applyTransforms(operations);
  });
}
