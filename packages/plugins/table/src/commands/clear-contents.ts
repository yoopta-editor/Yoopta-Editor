import type { YooEditor } from '@yoopta/editor';
import { Blocks } from '@yoopta/editor';
import type { Path } from 'slate';
import { Editor, Transforms } from 'slate';

import type { TableCellElement } from '../types';

export type ClearContentsOptions = {
  cells: [TableCellElement, Path][];
};

export const clearContents = (
  editor: YooEditor,
  blockId: string,
  options: ClearContentsOptions,
) => {
  const { cells } = options;

  if (!cells || cells.length === 0) {
    console.warn('No cells to clear');
    return;
  }

  const slate = Blocks.getBlockSlate(editor, { id: blockId });
  if (!slate) return;

  Editor.withoutNormalizing(slate, () => {
    cells.forEach(([cell, path]) => {
      // Remove all children
      for (let i = cell.children.length - 1; i >= 0; i--) {
        Transforms.removeNodes(slate, {
          at: [...path, i],
        });
      }

      // Insert empty text node
      Transforms.insertNodes(slate, { text: '' } as any, { at: [...path, 0] });
    });
  });

  // Update Yoopta editor state
  editor.emit('change', slate);
};
