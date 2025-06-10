import { Editor, Element, Node, Transforms } from 'slate';
import { SlateEditor, YooEditor } from '@yoopta/editor';
import { ACCORDION_ELEMENTS } from '../constants';

export function withAccordionListNormalize(slate: SlateEditor, editor: YooEditor) {
  const { normalizeNode } = slate;

  slate.normalizeNode = ([node, path]) => {
    if (!Element.isElement(node)) {
      return normalizeNode([node, path]);
    }

    if (node.type !== ACCORDION_ELEMENTS.AccordionList) {
      return normalizeNode([node, path]);
    }

    const parentNodeEntry = Editor.parent(slate, path);
    if (parentNodeEntry) {
      const [parentNode] = parentNodeEntry;

      if (Element.isElement(parentNode) && !Object.values(ACCORDION_ELEMENTS).includes(parentNode.type)) {
        Transforms.unwrapNodes(slate, { at: path });
        return;
      }
    }

    return normalizeNode([node, path]);
  };

  return slate;
}
