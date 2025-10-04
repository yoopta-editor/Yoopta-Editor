import { Path } from 'slate';
import { ReactEditor } from 'slate-react';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateElement, YooEditor } from '../types';

export function getParentElementPath(
  editor: YooEditor,
  blockId: string,
  element: SlateElement,
): Path | undefined {
  const block = editor.children[blockId];

  if (!block) {
    throw new Error(`Block with id ${blockId} not found`);
  }

  const slate = findSlateBySelectionPath(editor, { at: block.meta.order });

  if (!slate) {
    console.warn('No slate found');
    return [];
  }

  try {
    const path = ReactEditor.findPath(slate, element);
    return Path.parent(path);
  } catch (error) {}
}
