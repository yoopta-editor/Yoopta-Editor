import { Editor, Transforms } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';
import type { AddMarkOptions } from './types';

/**
 * Get array of block indices from options
 */
function getBlockIndices(editor: YooEditor, options: AddMarkOptions): number[] | null {
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
 * Add mark to specified selection or blocks
 *
 * @param editor - YooEditor instance
 * @param options - Add mark options
 *
 * @example
 * ```typescript
 * // Add bold mark to current text selection (slate.selection) or whole block
 * Marks.add(editor, {
 *   type: 'bold',
 *   value: true
 * });
 *
 * // Add mark to specific selection
 * Marks.add(editor, {
 *   type: 'bold',
 *   value: true,
 *   selection: { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 5 } }
 * });
 *
 * // Add color mark to specific block (ignores text selection)
 * Marks.add(editor, {
 *   type: 'color',
 *   value: '#ff0000',
 *   at: 0
 * });
 * ```
 */
export function addMark(editor: YooEditor, options: AddMarkOptions): void {
  const { type, value, selection } = options;
  const blockIndices = getBlockIndices(editor, options);

  // Handle specific selection
  if (selection) {
    const slate = findSlateBySelectionPath(editor);
    if (!slate) return;

    Transforms.select(slate, selection);
    Editor.addMark(slate, type, value);
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
      Editor.addMark(blockSlate, type, value);
    }

    return;
  }

  // Handle current text selection (slate.selection)
  const slate = findSlateBySelectionPath(editor);

  if (!slate?.selection) return;

  // Add mark to selection
  // For expanded selection: applies to selected text
  // For collapsed selection: applies to future typing
  Editor.addMark(slate, type, value);
}

