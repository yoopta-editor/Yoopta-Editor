import { Editor } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { GetPointOptions } from './types';

/**
 * Get start point from Slate selection (earlier point)
 *
 * @param editor - YooEditor instance
 * @param options - Get point options
 * @returns Start point or null
 *
 * @example
 * ```typescript
 * // Get start point from current selection
 * const start = Selection.getStart(editor);
 *
 * // Get start point from specific block
 * const start = Selection.getStart(editor, { at: 0 });
 * ```
 */
export function getStart(editor: YooEditor, options?: GetPointOptions) {
  const { at, blockId } = options ?? {};

  let slate;

  if (blockId) {
    slate = Blocks.getBlockSlate(editor, { id: blockId });
  } else if (typeof at === 'number') {
    slate = Blocks.getBlockSlate(editor, { at });
  } else {
    slate = findSlateBySelectionPath(editor);
  }

  if (!slate?.selection) return null;

  return Editor.start(slate, slate.selection);
}

