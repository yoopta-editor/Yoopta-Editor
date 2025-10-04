import type { SlateEditor, YooEditor } from '@yoopta/editor';
import { generateId } from '@yoopta/editor';
import { Element, Node, Transforms } from 'slate';

export function withTableNormalize(slate: SlateEditor, editor: YooEditor): SlateEditor {
  const { normalizeNode } = slate;

  slate.normalizeNode = (entry, options) => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === 'table-data-cell') {
      for (const [child, childPath] of Node.children(slate, path)) {
        if (Element.isElement(child) && child.type === 'table') {
          Transforms.unwrapNodes(slate, { at: childPath });
          return;
        }

        if (Element.isElement(child) && child.type === 'table-row') {
          Transforms.unwrapNodes(slate, { at: childPath });
          return;
        }

        if (Element.isElement(child) && child.type === 'table-data-cell') {
          Transforms.unwrapNodes(slate, { at: childPath });
          return;
        }
      }
    }

    if (Element.isElement(node) && node.type === 'table-row') {
      for (const [child, childPath] of Node.children(slate, path)) {
        if (!Element.isElement(child) || child.type !== 'table-data-cell') {
          return Transforms.wrapNodes(
            slate,
            {
              id: generateId(),
              type: 'table-data-cell',
              children: [child],
            } as Element,
            { at: childPath },
          );
        }
      }
    }

    normalizeNode(entry, options);
  };

  return slate;
}
