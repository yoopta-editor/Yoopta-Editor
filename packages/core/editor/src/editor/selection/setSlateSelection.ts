import { Transforms } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor, YooptaPath } from '../types';
import type { SetSlateSelectionOptions } from './types';

/**
 * Set Slate selection in block
 *
 * @param editor - YooEditor instance
 * @param options - Set selection options
 *
 * @example
 * ```typescript
 * // Set selection in current block
 * Selection.setSlateSelection(editor, {
 *   selection: { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 5 } }
 * });
 *
 * // Set selection in specific block
 * Selection.setSlateSelection(editor, {
 *   selection: { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 5 } },
 *   at: 0
 * });
 * ```
 */
export function setSlateSelection(editor: YooEditor, options: SetSlateSelectionOptions): void {
  const { selection, at, blockId } = options;

  let slate;

  if (blockId) {
    slate = Blocks.getBlockSlate(editor, { id: blockId });
  } else if (typeof at === 'number') {
    slate = Blocks.getBlockSlate(editor, { at });
  } else {
    slate = findSlateBySelectionPath(editor);
  }

  if (!slate) return;

  Transforms.select(slate, selection);

  // Update editor.path.selection
  const path: YooptaPath = {
    current: editor.path.current,
    selected: editor.path.selected,
    selection,
    source: editor.path.source ?? null,
  };

  editor.setPath(path);
}

