import type { SlateEditor } from '@yoopta/editor';
import { generateId } from '@yoopta/editor';
import { Editor, Element, Transforms } from 'slate';

import { ACCORDION_ELEMENTS } from '../constants';

export function withAccordionListItemNormalize(slate: SlateEditor) {
  const { normalizeNode } = slate;

  slate.normalizeNode = ([node, path]) => {
    if (!Element.isElement(node)) {
      return normalizeNode([node, path]);
    }

    if (node.type !== ACCORDION_ELEMENTS.AccordionListItem) {
      return normalizeNode([node, path]);
    }

    const parentNodeEntry = Editor.parent(slate, path);
    if (parentNodeEntry) {
      const [parentNode] = parentNodeEntry;

      if (Element.isElement(parentNode) && parentNode.type !== ACCORDION_ELEMENTS.AccordionList) {
        Transforms.unwrapNodes(slate, { at: path });
        return;
      }
    }

    const childrenEntries = Editor.nodes(slate, {
      at: path,
      match: (n) => Element.isElement(n),
      mode: 'lowest',
    });

    const children = Array.from(childrenEntries);

    if (
      children.length > 0 &&
      Element.isElement(children[0][0]) &&
      children[0][0].type !== ACCORDION_ELEMENTS.AccordionListItemHeading
    ) {
      Transforms.setNodes(
        slate,
        { id: generateId(), type: ACCORDION_ELEMENTS.AccordionListItemHeading, props: {} },
        { at: children[0][1] },
      );
      return;
    }

    if (
      children.length > 1 &&
      Element.isElement(children[1][0]) &&
      children[1][0].type !== ACCORDION_ELEMENTS.AccordionListItemContent
    ) {
      Transforms.setNodes(
        slate,
        { id: generateId(), type: ACCORDION_ELEMENTS.AccordionListItemContent, props: {} },
        { at: children[1][1] },
      );
      return;
    }

    if (children.length > 2) {
      for (let i = 2; i < children.length; i += 2) {
        const [listItemHeadingNode, listItemHeadingPath] = children[i];
        let [listItemContentNode, listItemContentPath] = children[i + 1] || [null, null];

        if (!listItemContentNode) {
          listItemContentNode = {
            id: generateId(),
            type: ACCORDION_ELEMENTS.AccordionListItemContent,
            children: [{ text: '' }],
          };
        }

        if (Element.isElement(listItemHeadingNode) && Element.isElement(listItemContentNode)) {
          if (listItemHeadingPath && Editor.hasPath(slate, listItemHeadingPath)) {
            Transforms.removeNodes(slate, { at: listItemHeadingPath });
          }
          if (listItemContentPath && Editor.hasPath(slate, listItemContentPath)) {
            Transforms.removeNodes(slate, { at: listItemContentPath });
          }
        }
      }
      return;
    }

    return normalizeNode([node, path]);
  };

  return slate;
}
