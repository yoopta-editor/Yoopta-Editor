import type { SlateEditor, YooEditor } from '@yoopta/editor';
import { Editor, Element, Transforms } from 'slate';

export function withCalloutNormalize(slate: SlateEditor, editor: YooEditor) {
  const { normalizeNode } = slate;

  slate.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (path.length === 0 && Editor.isEditor(node)) {
      const calloutElements = node.children.filter(
        (child) => Element.isElement(child) && child.type === 'callout',
      );

      if (calloutElements.length > 1 && editor.path.current !== null) {
        const currentPath = editor.path.current;

        const firstCalloutIndex = node.children.findIndex(
          (child) => Element.isElement(child) && child.type === 'callout',
        );

        if (firstCalloutIndex === -1) return;

        const newBlocks = calloutElements
          .slice(1)
          .map((callout) => {
            if (Element.isElement(callout)) {
              return {
                id: callout.id,
                type: 'Callout',
                value: [callout],
                meta: {
                  align: 'left',
                  depth: 0,
                  order: currentPath + 1,
                },
              };
            }
            return null;
          })
          .filter((block): block is any => !!block);

        for (let i = node.children.length - 1; i >= 0; i--) {
          const child = node.children[i];
          if (Element.isElement(child) && child.type === 'callout' && i !== firstCalloutIndex) {
            Transforms.removeNodes(slate, { at: [i] });
          }
        }

        editor.batchOperations(() => {
          newBlocks.forEach((block, index) => {
            editor.insertBlock('Callout', {
              at: currentPath + index + 1,
              blockData: {
                id: block.id,
                value: block.value,
                meta: block.meta,
              },
            });
          });
        });

        return;
      }
    }

    normalizeNode(entry);
  };

  return slate;
}
