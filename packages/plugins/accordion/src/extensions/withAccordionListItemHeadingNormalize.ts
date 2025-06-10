import { Editor, Element, Node, Path, Text, Transforms } from 'slate';
import { generateId, SlateEditor, YooEditor } from '@yoopta/editor';
import { ACCORDION_ELEMENTS } from '../constants';

export function withAccordionListItemHeadingNormalize(slate: SlateEditor, editor: YooEditor) {
  const { normalizeNode } = slate;

  slate.normalizeNode = ([node, path]) => {
    if (!Element.isElement(node)) {
      return normalizeNode([node, path]);
    }

    if (node.type !== ACCORDION_ELEMENTS.AccordionListItemHeading) {
      return normalizeNode([node, path]);
    }

    const nextSibling = Editor.next(slate, {
      at: path,
      match: (n) => Element.isElement(n),
    });

    if (nextSibling) {
      const [nextSiblingNode, nextSiblingPath] = nextSibling;
      if (Element.isElement(nextSiblingNode) && nextSiblingNode.type === ACCORDION_ELEMENTS.AccordionListItemContent) {
        Transforms.setNodes(
          slate,
          { id: generateId(), type: ACCORDION_ELEMENTS.AccordionListItemContent },
          { at: nextSiblingPath },
        );
        return;
      }
    }

    let prevPath;

    try {
      prevPath = Path.previous(path);
    } catch (error) {
      console.log('prevPath', prevPath);
    }

    const prevSibling = Editor.previous(slate, {
      at: path,
      match: (n) => Element.isElement(n),
    });

    if (prevSibling) {
      const [prevSiblingNode, prevSiblingPath] = prevSibling;
      if (Element.isElement(prevSiblingNode) && prevSiblingNode.type === ACCORDION_ELEMENTS.AccordionListItemContent) {
        Transforms.setNodes(
          slate,
          { id: generateId(), type: ACCORDION_ELEMENTS.AccordionListItemContent },
          { at: path },
        );
        return;
      }
    }
  };

  return slate;
}
