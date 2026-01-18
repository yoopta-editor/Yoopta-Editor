import { Range } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { GetSlateSelectionOptions } from './types';

/**
 * Check if Slate selection is collapsed (cursor position)
 *
 * @param editor - YooEditor instance
 * @param options - Check options
 * @returns True if selection is collapsed, false otherwise
 *
 * @example
 * ```typescript
 * // Check if current selection is collapsed
 * const isCollapsed = Selection.isCollapsed(editor);
 *
 * // Check if selection in specific block is collapsed
 * const isCollapsed = Selection.isCollapsed(editor, { at: 0 });
 * ```
 */
export function isCollapsed(editor: YooEditor, options?: GetSlateSelectionOptions): boolean {
  const { at, blockId } = options ?? {};

  let slate;

  if (blockId) {
    slate = Blocks.getBlockSlate(editor, { id: blockId });
  } else if (typeof at === 'number') {
    slate = Blocks.getBlockSlate(editor, { at });
  } else {
    slate = findSlateBySelectionPath(editor);
  }

  if (!slate?.selection) return true;

  return Range.isCollapsed(slate.selection);
}

