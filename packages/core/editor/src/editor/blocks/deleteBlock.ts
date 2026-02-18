import { deleteColumnGroup } from '../columns/deleteColumnGroup';
import { getColumnGroupBlocks } from '../columns/getColumnGroupBlocks';
import type { YooptaOperation } from '../core/applyTransforms';
import { Paths } from '../paths';
import type { YooEditor, YooptaPathIndex } from '../types';
import { getBlock } from './getBlock';
import { getBlockSlate } from './getBlockSlate';

export type DeleteBlockOptions = {
  /**
   * Block to delete (by path or id)
   * @default editor.path.current
   */
  at?: YooptaPathIndex;
  blockId?: string;

  /**
   * Focus after delete
   * @default true
   */
  focus?: boolean;

  /**
   * Focus target after delete
   * - 'previous': focus previous block (default)
   * - 'next': focus next block
   * - 'none': don't focus anything
   * @default 'previous'
   */
  focusTarget?: 'previous' | 'next' | 'none';
};

/**
 * Delete a block
 *
 * @param editor - YooEditor instance
 * @param options - Delete options
 *
 * @example
 * ```typescript
 * // Delete current block
 * editor.deleteBlock();
 *
 * // Delete specific block by path
 * editor.deleteBlock({ at: 3 });
 *
 * // Delete specific block by id
 * editor.deleteBlock({ blockId: 'block-123' });
 *
 * // Delete without focusing
 * editor.deleteBlock({ at: 3, focus: false });
 *
 * // Delete and focus next block instead of previous
 * editor.deleteBlock({ at: 3, focusTarget: 'next' });
 * ```
 */
export function deleteBlock(editor: YooEditor, options: DeleteBlockOptions = {}): void {
  const { at, blockId, focus = true, focusTarget = 'previous' } = options;

  // Determine which block to delete
  const blockPath = typeof at === 'number' ? at : editor.path.current;
  const block = getBlock(editor, { id: blockId, at: blockPath });

  if (!block) {
    return;
  }

  // Determine focus target block
  let targetBlock;
  let targetSlate;

  if (focus && focusTarget !== 'none') {
    if (focusTarget === 'previous') {
      const prevBlockPath = Paths.getPreviousBlockOrder(editor, block.meta.order);
      if (prevBlockPath !== null) {
        targetBlock = getBlock(editor, { at: prevBlockPath });
        targetSlate = targetBlock ? getBlockSlate(editor, { id: targetBlock.id }) : undefined;
      }
    } else if (focusTarget === 'next') {
      const nextBlockPath = Paths.getNextBlockOrder(editor, block.meta.order);
      if (nextBlockPath !== null) {
        targetBlock = getBlock(editor, { at: nextBlockPath });
        targetSlate = targetBlock ? getBlockSlate(editor, { id: targetBlock.id }) : undefined;
      }
    }
  }

  const blockToDelete = editor.children[block.id];
  const operations: YooptaOperation[] = [];

  // Call lifecycle hook
  const plugin = editor.plugins[blockToDelete.type];
  const { onDestroy } = plugin?.lifecycle ?? {};
  onDestroy?.(editor, blockToDelete.id);

  operations.push({
    type: 'delete_block',
    block: blockToDelete,
    path: editor.path,
  });

  editor.applyTransforms(operations, { validatePaths: false });

  // Focus target block if specified
  if (focus && focusTarget !== 'none' && targetBlock && targetSlate) {
    const lastNodePoint = Paths.getLastNodePoint(targetSlate);
    editor.focusBlock(targetBlock.id, { focusAt: lastNodePoint });
  }

  // Auto-dissolve column group if only one column index remains
  const columnGroup = block.meta.columnGroup;
  if (columnGroup) {
    const remainingBlocks = getColumnGroupBlocks(editor, columnGroup);
    const remainingColumnIndices = new Set(remainingBlocks.map((b) => b.meta.columnIndex));
    if (remainingColumnIndices.size <= 1) {
      deleteColumnGroup(editor, { columnGroup });
    }
  }
}
