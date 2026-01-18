import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { GetSlateSelectionOptions } from './types';

/**
 * Get Slate selection from block
 *
 * @param editor - YooEditor instance
 * @param options - Get selection options
 * @returns Slate selection (Range) or null
 *
 * @example
 * ```typescript
 * // Get selection from current block
 * const selection = Selection.getSlateSelection(editor);
 *
 * // Get selection from specific block
 * const selection = Selection.getSlateSelection(editor, { at: 0 });
 *
 * // Get selection from block by ID
 * const selection = Selection.getSlateSelection(editor, { blockId: 'block-1' });
 * ```
 */
export function getSlateSelection(
  editor: YooEditor,
  options?: GetSlateSelectionOptions,
): Range | null {
  const { at, blockId } = options ?? {};

  let slate;

  if (blockId) {
    slate = Blocks.getBlockSlate(editor, { id: blockId });
  } else if (typeof at === 'number') {
    slate = Blocks.getBlockSlate(editor, { at });
  } else {
    slate = findSlateBySelectionPath(editor);
  }

  return slate?.selection ?? null;
}

