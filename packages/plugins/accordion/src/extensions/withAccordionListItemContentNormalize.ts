import { Editor, Element, Node, Path, Text, Transforms } from 'slate';
import { SlateEditor, YooEditor } from '@yoopta/editor';
import { ACCORDION_ELEMENTS } from '../constants';

export function withAccordionListItemContentNormalize(slate: SlateEditor, editor: YooEditor) {
  const { normalizeNode } = slate;

  slate.normalizeNode = ([node, path]) => {
    if (!Element.isElement(node)) {
      return normalizeNode([node, path]);
    }

    if (node.type !== ACCORDION_ELEMENTS.AccordionListItemContent) {
      return normalizeNode([node, path]);
    }

    const nextSibling = Editor.next(slate, {
      at: path,
      match: (n) => Element.isElement(n),
    });

    if (nextSibling) {
      const [nextSiblingNode, nextSiblingPath] = nextSibling;
      if (Element.isElement(nextSiblingNode) && nextSiblingNode.type === ACCORDION_ELEMENTS.AccordionListItemContent) {
        Transforms.mergeNodes(slate, { at: nextSiblingPath, match: (n) => Element.isElement(n) });
        return;
      }
    }
  };

  return slate;
}
