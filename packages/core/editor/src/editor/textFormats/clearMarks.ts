import { Editor, Range, Transforms } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { ClearMarksOptions } from './types';

/**
 * Get array of block indices from options
 */
function getBlockIndices(editor: YooEditor, options: ClearMarksOptions): number[] | null {
  const { at, blockId, selection } = options;

  // If selection is provided, don't use block indices
  if (selection) {
    return null;
  }

  // Use selected blocks if available
  if (Array.isArray(editor.path.selected) && editor.path.selected.length > 0) {
    return editor.path.selected;
  }

  // Use provided at or blockId
  if (Array.isArray(at)) {
    return at.filter((index): index is number => typeof index === 'number');
  }

  if (typeof at === 'number') {
    return [at];
  }

  if (Array.isArray(blockId)) {
    return blockId
      .map((id) => {
        const block = Blocks.getBlock(editor, { id });
        return block?.meta.order;
      })
      .filter((order): order is number => typeof order === 'number');
  }

  if (blockId) {
    const block = Blocks.getBlock(editor, { id: blockId });
    return block?.meta.order !== undefined ? [block.meta.order] : [];
  }

  return null;
}

/**
 * Clear all marks from specified selection or blocks
 *
 * @param editor - YooEditor instance
 * @param options - Clear marks options
 *
 * @example
 * ```typescript
 * // Clear all marks from current text selection (slate.selection) or whole block
 * Marks.clear(editor);
 *
 * // Clear all marks from specific selection
 * Marks.clear(editor, {
 *   selection: { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 5 } }
 * });
 *
 * // Clear all marks from specific block
 * Marks.clear(editor, { at: 0 });
 *
 * // Clear all marks from multiple blocks
 * Marks.clear(editor, { at: [0, 1, 2] });
 * ```
 */
export function clearMarks(editor: YooEditor, options?: ClearMarksOptions): void {
  if (!options) {
    // No options - use current selection
    const slate = findSlateBySelectionPath(editor);
    if (!slate?.selection) return;

    const marks = Editor.marks(slate);
    if (marks) {
      Object.keys(marks).forEach((type) => {
        Editor.removeMark(slate, type);
      });
    }
    return;
  }

  const { selection } = options;
  const blockIndices = getBlockIndices(editor, options);

  // Handle specific selection
  if (selection) {
    const slate = findSlateBySelectionPath(editor);
    if (!slate) return;

    Transforms.select(slate, selection);
    const marks = Editor.marks(slate);
    if (marks) {
      Object.keys(marks).forEach((type) => {
        Editor.removeMark(slate, type);
      });
    }
    return;
  }

  // Handle multiple selected blocks
  if (blockIndices && blockIndices.length > 0) {
    for (const path of blockIndices) {
      const blockSlate = Blocks.getBlockSlate(editor, { at: path });

      if (!blockSlate) continue;

      const [node] = Editor.node(blockSlate, []);
      if (!node) continue;

      const end = Editor.end(blockSlate, []);
      const start = Editor.start(blockSlate, []);

      Transforms.select(blockSlate, { anchor: start, focus: end });

      // Remove all marks
      const marks = Editor.marks(blockSlate);
      if (marks) {
        Object.keys(marks).forEach((type) => {
          Editor.removeMark(blockSlate, type);
        });
      }
    }

    return;
  }

  // Handle current text selection (slate.selection)
  const slate = findSlateBySelectionPath(editor);

  if (!slate?.selection) return;

  // Remove all marks from selection
  const marks = Editor.marks(slate);
  if (marks) {
    Object.keys(marks).forEach((type) => {
      Editor.removeMark(slate, type);
    });
  }
}

