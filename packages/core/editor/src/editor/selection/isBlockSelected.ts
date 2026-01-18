import type { YooEditor, YooptaBlockData } from '../types';
import type { IsBlockSelectedOptions } from './types';

/**
 * Check if block is selected
 *
 * @param editor - YooEditor instance
 * @param options - Check options
 * @returns True if block is selected, false otherwise
 *
 * @example
 * ```typescript
 * // Check if block at order 0 is selected
 * const isSelected = Selection.isBlockSelected(editor, { at: 0 });
 *
 * // Check if block is selected (by block data)
 * const block = Blocks.getBlock(editor, { at: 0 });
 * if (block) {
 *   const isSelected = Selection.isBlockSelected(editor, { at: block.meta.order });
 * }
 * ```
 */
export function isBlockSelected(editor: YooEditor, options: IsBlockSelectedOptions): boolean {
  const { at } = options;
  const selected = editor.path.selected;

  if (Array.isArray(selected)) {
    return selected.includes(at);
  }

  return false;
}

