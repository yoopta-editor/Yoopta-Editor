import type { YooEditor, YooptaPathIndex } from '../types';
import type { GetSelectedOptions } from './types';

/**
 * Get selected block orders or check if specific block is selected
 *
 * @param editor - YooEditor instance
 * @param options - Get selected options
 * @returns Selected block orders array, or boolean if `at` is provided
 *
 * @example
 * ```typescript
 * // Get all selected block orders
 * const selected = Selection.getSelected(editor);
 *
 * // Check if specific block is selected
 * const isSelected = Selection.getSelected(editor, { at: 0 });
 * ```
 */
export function getSelected(
  editor: YooEditor,
  options?: GetSelectedOptions,
): number[] | null | boolean {
  const selected = editor.path.selected;

  if (options?.at !== undefined) {
    if (Array.isArray(selected)) {
      return selected.includes(options.at);
    }
    return false;
  }

  return selected;
}

