import { Range } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { GetSlateSelectionOptions } from './types';

/**
 * Check if Slate selection is expanded (has selected text)
 *
 * @param editor - YooEditor instance
 * @param options - Check options
 * @returns True if selection is expanded, false otherwise
 *
 * @example
 * ```typescript
 * // Check if current selection is expanded
 * const isExpanded = Selection.isExpanded(editor);
 *
 * // Check if selection in specific block is expanded
 * const isExpanded = Selection.isExpanded(editor, { at: 0 });
 * ```
 */
export function isExpanded(editor: YooEditor, options?: GetSlateSelectionOptions): boolean {
  const { at, blockId } = options ?? {};

  let slate;

  if (blockId) {
    slate = Blocks.getBlockSlate(editor, { id: blockId });
  } else if (typeof at === 'number') {
    slate = Blocks.getBlockSlate(editor, { at });
  } else {
    slate = findSlateBySelectionPath(editor);
  }

  if (!slate?.selection) return false;

  return Range.isExpanded(slate.selection);
}

