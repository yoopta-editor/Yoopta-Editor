import { Editor } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { GetMarkValueOptions } from './types';

/**
 * Get mark value from current selection or specified block
 *
 * @param editor - YooEditor instance
 * @param options - Get mark value options
 * @returns Mark value or null if not found
 *
 * @example
 * ```typescript
 * // Get mark value from current selection
 * const boldValue = Marks.getValue(editor, { type: 'bold' });
 *
 * // Get mark value from specific block
 * const italicValue = Marks.getValue(editor, {
 *   type: 'italic',
 *   at: 0
 * });
 * ```
 */
export function getValue(editor: YooEditor, options: GetMarkValueOptions): unknown | null {
  const { type, at, blockId } = options;

  let slate;

  if (blockId) {
    slate = Blocks.getBlockSlate(editor, { id: blockId });
  } else if (typeof at === 'number') {
    slate = Blocks.getBlockSlate(editor, { at });
  } else {
    slate = findSlateBySelectionPath(editor);
  }

  if (!slate) return null;

  const marks = Editor.marks(slate);
  return marks?.[type] ?? null;
}

