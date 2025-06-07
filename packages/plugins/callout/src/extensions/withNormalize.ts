import { Editor, Element, Transforms } from 'slate';
import { SlateEditor, YooEditor } from '@yoopta/editor';

export function withNormalize(slate: SlateEditor, editor: YooEditor) {
  const { normalizeNode } = slate;

  slate.normalizeNode = (entry) => {
    const [node, path] = entry;

    // Check if we're at the root level
    if (path.length === 0 && Editor.isEditor(node)) {
      // Get all callout elements from children
      const calloutElements = node.children.filter((child) => Element.isElement(child) && child.type === 'callout');

      // If there are multiple callout elements, keep first one and create new blocks for others
      if (calloutElements.length > 1 && editor.path.current !== null) {
        const currentPath = editor.path.current;

        // Find the first callout element's index
        const firstCalloutIndex = node.children.findIndex(
          (child) => Element.isElement(child) && child.type === 'callout',
        );

        if (firstCalloutIndex === -1) return;

        // Create new blocks for the rest of the callouts
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
                  order: currentPath + 1, // Will be adjusted by insertBlock
                },
              };
            }
            return null;
          })
          .filter((block): block is any => !!block);

        // Remove all callout elements except the first one
        // We need to do this in reverse order to avoid index shifting
        for (let i = node.children.length - 1; i >= 0; i--) {
          const child = node.children[i];
          if (Element.isElement(child) && child.type === 'callout' && i !== firstCalloutIndex) {
            Transforms.removeNodes(slate, { at: [i] });
          }
        }

        editor.batchOperations(() => {
          // Insert new blocks after the current one
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

    // Call the original normalizeNode for other cases
    normalizeNode(entry);
  };

  return slate;
}
