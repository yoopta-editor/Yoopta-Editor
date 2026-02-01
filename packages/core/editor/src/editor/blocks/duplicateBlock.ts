import cloneDeep from 'lodash.clonedeep';

import { generateId } from '../../utils/generateId';
import type { YooptaOperation } from '../core/applyTransforms';
import type { SlateElement, YooEditor, YooptaBlockData, YooptaPathIndex } from '../types';
import { getBlock } from './getBlock';

export type DuplicateBlockOptions = {
  /**
   * Block to duplicate (by path or id)
   * @default editor.path.current
   */
  at?: YooptaPathIndex;
  blockId?: string;

  /**
   * Position to insert duplicate
   * If not provided, inserts after original block
   * @default original.meta.order + 1
   */
  insertAt?: YooptaPathIndex;

  /**
   * Focus after duplicate
   * @default true
   */
  focus?: boolean;

  /**
   * Custom element structure for duplicate
   * If provided, overrides default duplication
   */
  elements?: SlateElement;
};

/**
 * Duplicate a block
 *
 * @param editor - YooEditor instance
 * @param options - Duplicate options
 * @returns ID of the newly created block
 *
 * @example
 * ```typescript
 * // Duplicate current block
 * const newId = editor.duplicateBlock();
 *
 * // Duplicate specific block by path
 * const newId = editor.duplicateBlock({ at: 3 });
 *
 * // Duplicate specific block by id
 * const newId = editor.duplicateBlock({ blockId: 'block-123' });
 *
 * // Duplicate and insert at specific position
 * const newId = editor.duplicateBlock({ at: 3, insertAt: 0 });
 * ```
 */
export function duplicateBlock(
  editor: YooEditor,
  options: DuplicateBlockOptions = {},
): string | undefined {
  const { at, blockId, insertAt, focus = true, elements } = options;

  // Determine which block to duplicate
  const blockPath = typeof at === 'number' ? at : editor.path.current;
  const originalBlock: YooptaBlockData | null = blockId
    ? editor.children[blockId]
    : getBlock(editor, { at: blockPath });

  if (!originalBlock) {
    return undefined;
  }

  const operations: YooptaOperation[] = [];

  const duplicatedBlock = cloneDeep(originalBlock);
  duplicatedBlock.id = generateId();

  // Determine insert position
  if (typeof insertAt === 'number') {
    duplicatedBlock.meta.order = insertAt;
  } else {
    duplicatedBlock.meta.order = originalBlock.meta.order + 1;
  }

  // Use custom elements if provided
  if (elements) {
    duplicatedBlock.value = [elements];
  }

  operations.push({
    type: 'insert_block',
    path: { current: duplicatedBlock.meta.order },
    block: duplicatedBlock,
  });

  editor.applyTransforms(operations);

  if (focus) {
    editor.focusBlock(duplicatedBlock.id, { waitExecution: true });
  }

  return duplicatedBlock.id;
}
