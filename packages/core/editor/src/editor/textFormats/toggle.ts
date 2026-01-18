import { Editor, Transforms } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { SlateEditor, YooEditor } from '../types';
import { isActive } from './isActive';
import type { ToggleMarkOptions } from './types';

type SelectedBlockEntity = {
  isActiveMark: boolean;
  slate: SlateEditor;
};

/**
 * Get array of block indices from options
 */
function getBlockIndices(editor: YooEditor, options: ToggleMarkOptions): number[] | null {
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
 * Toggle mark in specified selection or blocks
 *
 * @param editor - YooEditor instance
 * @param options - Toggle mark options
 *
 * @example
 * ```typescript
 * // Toggle bold in current text selection (slate.selection) or whole block
 * Marks.toggle(editor, { type: 'bold' });
 *
 * // Toggle mark in specific selection
 * Marks.toggle(editor, {
 *   type: 'bold',
 *   selection: { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 5 } }
 * });
 *
 * // Toggle italic in specific block
 * Marks.toggle(editor, {
 *   type: 'italic',
 *   at: 0
 * });
 *
 * // Toggle underline in multiple blocks
 * Marks.toggle(editor, {
 *   type: 'underline',
 *   at: [0, 1, 2]
 * });
 * ```
 */
export function toggle(editor: YooEditor, options: ToggleMarkOptions): void {
  const { type, selection } = options;
  const blockIndices = getBlockIndices(editor, options);

  // Handle specific selection
  if (selection) {
    const slate = findSlateBySelectionPath(editor);
    if (!slate) return;

    Transforms.select(slate, selection);
    const active = isActive(editor, { type, at: undefined, blockId: undefined });

    if (!active) {
      Editor.addMark(slate, type, true);
    } else {
      Editor.removeMark(slate, type);
    }
    return;
  }

  // Handle multiple selected blocks
  if (blockIndices && blockIndices.length > 0) {
    const selectedBlockEntities: SelectedBlockEntity[] = blockIndices
      .map((path) => {
        const blockSlate = Blocks.getBlockSlate(editor, { at: path });

        if (!blockSlate) return null;

        const [node] = Editor.node(blockSlate, []);
        if (!node) return null;

        const end = Editor.end(blockSlate, []);
        const start = Editor.start(blockSlate, []);
        Transforms.select(blockSlate, { anchor: start, focus: end });

        const marks = Editor.marks(blockSlate);

        return {
          slate: blockSlate,
          isActiveMark: !!marks?.[type],
        };
      })
      .filter((entity): entity is SelectedBlockEntity => entity !== null);

    const isAllActive = selectedBlockEntities.every((entity) => entity.isActiveMark);

    for (const blockEntity of selectedBlockEntities) {
      if (blockEntity.isActiveMark) {
        if (isAllActive) {
          Editor.removeMark(blockEntity.slate, type);
        }
      } else {
        Editor.addMark(blockEntity.slate, type, true);
      }
    }

    return;
  }

  // Handle current text selection (slate.selection)
  const slate = findSlateBySelectionPath(editor);

  if (!slate?.selection) return;

  const active = isActive(editor, { type, at: undefined, blockId: undefined });

  // Toggle mark in selection
  if (!active) {
    Editor.addMark(slate, type, true);
  } else {
    Editor.removeMark(slate, type);
  }
}

