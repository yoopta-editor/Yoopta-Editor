import type { Path } from 'slate';
import { Editor, Element } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateElement, YooEditor } from '../types';

export type EmptyBlockElement = {
  type: string;
  path: Path;
};

export function isElementEmpty(
  editor: YooEditor,
  blockId: string,
  element: EmptyBlockElement,
): boolean | undefined {
  const block = editor.children[blockId];

  if (!block) {
    throw new Error(`Block with id ${blockId} not found`);
  }

  const slate = findSlateBySelectionPath(editor, { at: block.meta.order });

  if (!slate) {
    console.warn('No slate found');
    return;
  }

  const [elementEntry] = Editor.nodes<SlateElement>(slate, {
    at: element.path || slate.selection,
    match: (n) => Element.isElement(n) && n.type === element.type,
  });

  if (elementEntry) {
    const [node, nodePath] = elementEntry;
    const string = Editor.string(slate, nodePath);

    return string.trim().length === 0;
  }

  return false;
}
