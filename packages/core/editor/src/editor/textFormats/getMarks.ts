import { Editor } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { GetMarksOptions } from './types';

/**
 * Get all marks from current selection or specified block
 *
 * @param editor - YooEditor instance
 * @param options - Get marks options
 * @returns Object with all marks or null if no slate found
 *
 * @example
 * ```typescript
 * // Get all marks from current selection
 * const marks = Marks.getAll(editor);
 *
 * // Get all marks from specific block
 * const marks = Marks.getAll(editor, { at: 0 });
 * ```
 */
export function getMarks(
  editor: YooEditor,
  options?: GetMarksOptions,
): Record<string, unknown> | null {
  const { at, blockId } = options ?? {};

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
  return marks ?? null;
}

