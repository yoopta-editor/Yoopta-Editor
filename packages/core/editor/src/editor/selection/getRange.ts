import { Editor, Range } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { GetRangeOptions } from './types';

/**
 * Get range from Slate selection
 *
 * @param editor - YooEditor instance
 * @param options - Get range options
 * @returns Range or null if no selection
 *
 * @example
 * ```typescript
 * // Get range from current block selection
 * const range = Selection.getRange(editor);
 *
 * // Get range from specific block
 * const range = Selection.getRange(editor, { at: 0 });
 * ```
 */
export function getRange(editor: YooEditor, options?: GetRangeOptions): Range | null {
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

  return Editor.range(slate, slate.selection);
}

