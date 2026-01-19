import { Editor } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { GetPointOptions } from './types';

/**
 * Get end point from Slate selection (later point)
 *
 * @param editor - YooEditor instance
 * @param options - Get point options
 * @returns End point or null
 *
 * @example
 * ```typescript
 * // Get end point from current selection
 * const end = Selection.getEnd(editor);
 *
 * // Get end point from specific block
 * const end = Selection.getEnd(editor, { at: 0 });
 * ```
 */
export function getEnd(editor: YooEditor, options?: GetPointOptions) {
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

  return Editor.end(slate, slate.selection);
}

