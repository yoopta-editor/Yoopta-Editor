import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { GetPointOptions } from './types';

/**
 * Get anchor point from Slate selection
 *
 * @param editor - YooEditor instance
 * @param options - Get point options
 * @returns Anchor point or null
 *
 * @example
 * ```typescript
 * // Get anchor point from current selection
 * const anchor = Selection.getAnchor(editor);
 *
 * // Get anchor point from specific block
 * const anchor = Selection.getAnchor(editor, { at: 0 });
 * ```
 */
export function getAnchor(editor: YooEditor, options?: GetPointOptions) {
  const { at, blockId } = options ?? {};

  let slate;

  if (blockId) {
    slate = Blocks.getBlockSlate(editor, { id: blockId });
  } else if (typeof at === 'number') {
    slate = Blocks.getBlockSlate(editor, { at });
  } else {
    slate = findSlateBySelectionPath(editor);
  }

  return slate?.selection?.anchor ?? null;
}

