import { Editor, Range, Transforms } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { UpdateMarkOptions } from './types';

/**
 * Get array of block indices from options
 */
function getBlockIndices(editor: YooEditor, options: UpdateMarkOptions): number[] | null {
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
 * Update mark value in specified selection or blocks
 *
 * @param editor - YooEditor instance
 * @param options - Update mark options
 *
 * @example
 * ```typescript
 * // Update color mark in current text selection (slate.selection) or whole block
 * Marks.update(editor, {
 *   type: 'color',
 *   value: '#ff0000'
 * });
 *
 * // Update mark in specific selection
 * Marks.update(editor, {
 *   type: 'color',
 *   value: '#ff0000',
 *   selection: { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 5 } }
 * });
 *
 * // Update font size in specific block
 * Marks.update(editor, {
 *   type: 'fontSize',
 *   value: 16,
 *   at: 0
 * });
 * ```
 */
export function update(editor: YooEditor, options: UpdateMarkOptions): void {
  const { type, value, selection } = options;
  const blockIndices = getBlockIndices(editor, options);

  // Handle specific selection
  if (selection) {
    const slate = findSlateBySelectionPath(editor);
    if (!slate) return;

    Transforms.select(slate, selection);

    if (Range.isExpanded(selection)) {
      // For expanded selection: apply mark to selected text
      Editor.addMark(slate, type, value);
    } else {
      // For collapsed selection: toggle the mark (remove if active, add if not)
      const marks = Editor.marks(slate);
      const isActive = !!marks?.[type];

      if (isActive) {
        Editor.removeMark(slate, type);
      } else {
        Editor.addMark(slate, type, value);
      }
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

      const marks = Editor.marks(blockSlate);
      const isActive = !!marks?.[type];

      if (isActive) {
        Editor.removeMark(blockSlate, type);
      } else {
        Editor.addMark(blockSlate, type, value);
      }
    }

    return;
  }

  // Handle current text selection (slate.selection)
  const slate = findSlateBySelectionPath(editor);

  if (!slate?.selection) return;

  // Update mark in selection
  if (Range.isExpanded(slate.selection)) {
    // For expanded selection: apply mark to selected text
    Editor.addMark(slate, type, value);
  } else {
    // For collapsed selection: toggle the mark (remove if active, add if not)
    const marks = Editor.marks(slate);
    const isActive = !!marks?.[type];

    if (isActive) {
      Editor.removeMark(slate, type);
    } else {
      Editor.addMark(slate, type, value);
    }
  }
}

