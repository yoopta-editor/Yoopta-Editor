import type { YooptaOperation } from '../core/applyTransforms';
import type { YooEditor } from '../types';
import { getColumnGroupBlocks } from './getColumnGroupBlocks';

export type DeleteColumnGroupOptions = {
  columnGroup: string;
};

/**
 * Remove column metadata from all blocks in a group.
 * Blocks themselves remain in the editor — only column layout is removed.
 */
export function deleteColumnGroup(editor: YooEditor, options: DeleteColumnGroupOptions): void {
  const { columnGroup } = options;

  const groupBlocks = getColumnGroupBlocks(editor, columnGroup);
  if (groupBlocks.length === 0) return;

  const operations: YooptaOperation[] = [];

  for (const block of groupBlocks) {
    operations.push({
      type: 'set_block_meta',
      id: block.id,
      properties: {
        columnGroup: undefined,
        columnIndex: undefined,
        columnWidth: undefined,
      },
      prevProperties: {
        columnGroup: block.meta.columnGroup,
        columnIndex: block.meta.columnIndex,
        columnWidth: block.meta.columnWidth,
      },
    });
  }

  editor.batchOperations(() => {
    editor.applyTransforms(operations);
  });
}
