import type { YooptaOperation } from '../core/applyTransforms';
import type { YooEditor } from '../types';
import { getColumnGroupBlocks } from './getColumnGroupBlocks';

export type RemoveFromColumnOptions = {
  blockId: string;
};

/**
 * Remove a block from its column group.
 * If only one column index remains after removal, the group is dissolved entirely.
 */
export function removeFromColumn(editor: YooEditor, options: RemoveFromColumnOptions): void {
  const { blockId } = options;

  const block = editor.children[blockId];
  if (!block?.meta.columnGroup) return;

  const columnGroup = block.meta.columnGroup;
  const groupBlocks = getColumnGroupBlocks(editor, columnGroup);

  // Get unique column indices excluding the block being removed
  const remainingColumnIndices = new Set(
    groupBlocks
      .filter((b) => b.id !== blockId)
      .map((b) => b.meta.columnIndex),
  );

  editor.batchOperations(() => {
    if (remainingColumnIndices.size <= 1) {
      // Dissolve the entire group
      const operations: YooptaOperation[] = [];
      for (const b of groupBlocks) {
        operations.push({
          type: 'set_block_meta',
          id: b.id,
          properties: {
            columnGroup: undefined,
            columnIndex: undefined,
            columnWidth: undefined,
          },
          prevProperties: {
            columnGroup: b.meta.columnGroup,
            columnIndex: b.meta.columnIndex,
            columnWidth: b.meta.columnWidth,
          },
        });
      }
      editor.applyTransforms(operations);
    } else {
      // Just remove this block from the group
      const operations: YooptaOperation[] = [
        {
          type: 'set_block_meta',
          id: blockId,
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
        },
      ];
      editor.applyTransforms(operations);
    }
  });
}
