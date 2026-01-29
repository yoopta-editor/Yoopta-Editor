import type { Descendant } from 'slate';
import { Element, Text } from 'slate';

/**
 * Extracts plain text from Slate nodes (no HTML).
 * Use this for TOC labels instead of serializeTextNodes (which returns HTML).
 */
export function getPlainTextFromNodes(nodes: Descendant[]): string {
  return nodes
    .map((node) => {
      if (Text.isText(node)) return node.text;
      if (Element.isElement(node) && node.children?.length) {
        return getPlainTextFromNodes(node.children as Descendant[]);
      }
      return '';
    })
    .join('');
}
