import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { getLastNodePoint } from '../../utils/get-node-points';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { GetPointOptions } from './types';

/**
 * Get last point in block
 *
 * @param editor - YooEditor instance
 * @param options - Get point options
 * @returns Last point in block
 *
 * @example
 * ```typescript
 * // Get last point in current block
 * const lastPoint = Selection.getLastPoint(editor);
 *
 * // Get last point in specific block
 * const lastPoint = Selection.getLastPoint(editor, { at: 0 });
 * ```
 */
export function getLastPoint(editor: YooEditor, options?: GetPointOptions) {
  const { at, blockId } = options ?? {};

  let slate;

  if (blockId) {
    slate = Blocks.getBlockSlate(editor, { id: blockId });
  } else if (typeof at === 'number') {
    slate = Blocks.getBlockSlate(editor, { at });
  } else {
    slate = findSlateBySelectionPath(editor);
  }

  if (!slate) {
    return { path: [0, 0], offset: 0 };
  }

  return getLastNodePoint(slate);
}

