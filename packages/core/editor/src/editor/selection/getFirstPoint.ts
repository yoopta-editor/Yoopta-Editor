import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import { getFirstNodePoint } from '../../utils/get-node-points';
import type { YooEditor } from '../types';
import type { GetPointOptions } from './types';

/**
 * Get first point in block
 *
 * @param editor - YooEditor instance
 * @param options - Get point options
 * @returns First point in block
 *
 * @example
 * ```typescript
 * // Get first point in current block
 * const firstPoint = Selection.getFirstPoint(editor);
 *
 * // Get first point in specific block
 * const firstPoint = Selection.getFirstPoint(editor, { at: 0 });
 * ```
 */
export function getFirstPoint(editor: YooEditor, options?: GetPointOptions) {
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

  return getFirstNodePoint(slate);
}

