import type { Descendant } from 'slate';

import type { YooEditor } from '../editor/types';
import { generateId } from '../utils/generateId';

// [TODO] - Move to @yoopta/utils or @yoopta/editor/utils
// helpers for deserializing text nodes when you use custom parsers in your plugins
export function deserializeTextNodes(
  editor: YooEditor,
  nodes: NodeListOf<ChildNode>,
): Descendant[] {
  const deserializedNodes: Descendant[] = [];

  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      deserializedNodes.push({
        text: node.textContent || '',
      });
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;

      // [TODO] - Hmmmm
      if (element.nodeName === 'P' || element.nodeName === 'SPAN' || element.nodeName === 'DIV') {
        deserializedNodes.push({
          ...deserializeTextNodes(editor, element.childNodes)[0],
        });
      }

      if (element.nodeName === 'B' || element.nodeName === 'STRONG') {
        deserializedNodes.push({
          // @ts-ignore [FIXME] - Fix types
          bold: true,
          ...deserializeTextNodes(editor, element.childNodes)[0],
        });
      }

      if (element.nodeName === 'I' || element.nodeName === 'EM') {
        deserializedNodes.push({
          // @ts-ignore [FIXME] - Fix types
          italic: true,
          ...deserializeTextNodes(editor, element.childNodes)[0],
        });
      }

      if (element.nodeName === 'S' || element.nodeName === 'STRIKE') {
        deserializedNodes.push({
          // @ts-ignore [FIXME] - Fix types
          strike: true,
          ...deserializeTextNodes(editor, element.childNodes)[0],
        });
      }

      if (element.nodeName === 'U' || element.nodeName === 'INS') {
        deserializedNodes.push({
          // @ts-ignore [FIXME] - Fix types
          underline: true,
          ...deserializeTextNodes(editor, element.childNodes)[0],
        });
      }

      if (element.nodeName === 'CODE') {
        deserializedNodes.push({
          // @ts-ignore [FIXME] - Fix types
          code: true,
          ...deserializeTextNodes(editor, element.childNodes)[0],
        });
      }

      if (element.nodeName === 'MARK') {
        const color = element.style.color;
        const backgroundColor = element.style.backgroundColor || 'transparent';

        deserializedNodes.push({
          // @ts-ignore [FIXME] - Fix types
          highlight: { color, backgroundColor },
          ...deserializeTextNodes(editor, element.childNodes)[0],
        });
      }

      if (element.nodeName === 'A') {
        deserializedNodes.push({
          id: generateId(),
          type: 'link',
          props: {
            url: element.getAttribute('href') || '',
            target: element.getAttribute('target') || '',
            rel: element.getAttribute('rel') || '',
          },
          children: deserializeTextNodes(editor, element.childNodes),
        });
      }
    }
  });

  // @ts-ignore [FIXME] - Fix types
  if (deserializedNodes.length === 0 && !deserializedNodes[0]?.text) {
    deserializedNodes.push({ text: '' });
  }

  return deserializedNodes;
}
