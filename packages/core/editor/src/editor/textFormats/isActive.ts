import { Editor } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { IsMarkActiveOptions } from './types';

/**
 * Check if mark is active in current selection or specified block
 *
 * @param editor - YooEditor instance
 * @param options - Check mark active options
 * @returns True if mark is active, false otherwise
 *
 * @example
 * ```typescript
 * // Check if bold is active in current selection
 * const isBold = Marks.isActive(editor, { type: 'bold' });
 *
 * // Check if italic is active in specific block
 * const isItalic = Marks.isActive(editor, {
 *   type: 'italic',
 *   at: 0
 * });
 * ```
 */
export function isActive(editor: YooEditor, options: IsMarkActiveOptions): boolean {
  const { type, at, blockId } = options;

  let slate;

  if (blockId) {
    slate = Blocks.getBlockSlate(editor, { id: blockId });
  } else if (typeof at === 'number') {
    slate = Blocks.getBlockSlate(editor, { at });
  } else {
    slate = findSlateBySelectionPath(editor);
  }

  if (!slate) return false;

  const marks = Editor.marks(slate);
  return !!marks?.[type];
}

