import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { GetPointOptions } from './types';

/**
 * Get focus point from Slate selection
 *
 * @param editor - YooEditor instance
 * @param options - Get point options
 * @returns Focus point or null
 *
 * @example
 * ```typescript
 * // Get focus point from current selection
 * const focus = Selection.getFocus(editor);
 *
 * // Get focus point from specific block
 * const focus = Selection.getFocus(editor, { at: 0 });
 * ```
 */
export function getFocus(editor: YooEditor, options?: GetPointOptions) {
  const { at, blockId } = options ?? {};

  let slate;

  if (blockId) {
    slate = Blocks.getBlockSlate(editor, { id: blockId });
  } else if (typeof at === 'number') {
    slate = Blocks.getBlockSlate(editor, { at });
  } else {
    slate = findSlateBySelectionPath(editor);
  }

  return slate?.selection?.focus ?? null;
}

