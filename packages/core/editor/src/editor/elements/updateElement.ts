import type { Path} from 'slate';
import { Editor, Element, Transforms } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateElement, YooEditor } from '../types';

export type UpdateElementOptions = {
  path?: Path;
};

export type UpdateElement<TElementKeys extends string, TElementProps> = Partial<
  Omit<SlateElement<TElementKeys, TElementProps>, 'id'>
>;

export function updateElement<TElementKeys extends string, TElementProps>(
  editor: YooEditor,
  blockId: string,
  element: UpdateElement<TElementKeys, TElementProps>,
  options?: UpdateElementOptions,
) {
  const block = editor.children[blockId];

  if (!block) {
    throw new Error(`Block with id ${blockId} not found`);
  }

  const slate = findSlateBySelectionPath(editor, { at: block.meta.order });

  if (!slate) {
    console.warn('No slate found');
    return;
  }

  Editor.withoutNormalizing(slate, () => {
    const [elementEntry] = Editor.nodes<SlateElement>(slate, {
      at: options?.path || [0],
      match: (n) => Element.isElement(n) && n.type === element.type,
    });

    const elementToUpdate = elementEntry?.[0];
    const elementToUpdatePath = elementEntry?.[1];

    const props = elementToUpdate?.props || {};
    const updatedElement = { props: { ...props, ...element.props } };

    Transforms.setNodes<SlateElement>(slate, updatedElement, {
      at: options?.path || elementToUpdatePath || [0],
      match: (n) => Element.isElement(n) && n.type === element.type,
      mode: 'lowest',
    });

    // editor.emit('change', { value: editor.children, operations: [] });
  });
}
