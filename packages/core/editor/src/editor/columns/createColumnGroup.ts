import { generateId } from '../../utils/generateId';
import type { YooptaOperation } from '../core/applyTransforms';
import type { YooEditor } from '../types';

export type CreateColumnGroupOptions = {
  blockIds: string[];
  columnWidths?: number[];
};

/**
 * Create a column group from existing blocks.
 * Each block becomes its own column (one block per column).
 * Blocks must exist in editor.children.
 *
 * @returns The column group ID, or undefined if creation failed.
 */
export function createColumnGroup(
  editor: YooEditor,
  options: CreateColumnGroupOptions,
): string | undefined {
  const { blockIds, columnWidths } = options;

  if (blockIds.length < 2) {
    console.warn('createColumnGroup requires at least 2 blocks');
    return undefined;
  }

  // Validate all blocks exist
  for (const id of blockIds) {
    if (!editor.children[id]) {
      console.warn(`Block ${id} not found`);
      return undefined;
    }
  }

  const columnGroup = generateId();
  const defaultWidth = Math.floor(100 / blockIds.length);

  editor.batchOperations(() => {
    const operations: YooptaOperation[] = [];

    // Sort blocks by their current order to ensure consecutive placement
    const sortedBlockIds = [...blockIds].sort(
      (a, b) => editor.children[a].meta.order - editor.children[b].meta.order,
    );

    sortedBlockIds.forEach((blockId, index) => {
      const block = editor.children[blockId];
      const width = columnWidths?.[index] ?? defaultWidth;

      operations.push({
        type: 'set_block_meta',
        id: blockId,
        properties: {
          columnGroup,
          columnIndex: index,
          columnWidth: width,
        },
        prevProperties: {
          columnGroup: block.meta.columnGroup,
          columnIndex: block.meta.columnIndex,
          columnWidth: block.meta.columnWidth,
        },
      });
    });

    editor.applyTransforms(operations);
  });

  return columnGroup;
}
