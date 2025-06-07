import { generateId, SlateEditor, YooEditor, YooptaBlockData } from '@yoopta/editor';
import { Editor, Element, Transforms } from 'slate';

export function withNormalize(slate: SlateEditor, editor: YooEditor) {
  const { normalizeNode } = slate;

  slate.normalizeNode = (entry) => {
    const [node, path] = entry;

    // Check if we're at the root level
    if (path.length === 0 && Editor.isEditor(node)) {
      // Get all paragraph elements from children
      const paragraphElements = node.children.filter((child) => Element.isElement(child) && child.type === 'paragraph');

      // If there are multiple paragraph elements, keep first one and create new blocks for others
      if (paragraphElements.length > 1 && editor.path.current !== null) {
        const currentPath = editor.path.current;

        // Find the first paragraph element's index
        const firstParagraphIndex = node.children.findIndex(
          (child) => Element.isElement(child) && child.type === 'paragraph',
        );

        if (firstParagraphIndex === -1) return;

        // Create new blocks for the rest of the paragraphs
        const newBlocks = paragraphElements
          .slice(1)
          .map((paragraph) => {
            if (Element.isElement(paragraph)) {
              return {
                id: generateId(),
                type: 'Paragraph',
                value: [paragraph],
                meta: {
                  align: 'left',
                  depth: 0,
                  order: currentPath + 1, // Will be adjusted by insertBlock
                },
              } as YooptaBlockData;
            }
            return null;
          })
          .filter((block): block is YooptaBlockData => !!block);

        // Remove all paragraph elements except the first one
        // We need to do this in reverse order to avoid index shifting
        for (let i = node.children.length - 1; i >= 0; i--) {
          const child = node.children[i];
          if (Element.isElement(child) && child.type === 'paragraph' && i !== firstParagraphIndex) {
            Transforms.removeNodes(slate, { at: [i] });
          }
        }

        editor.batchOperations(() => {
          // Insert new blocks after the current one
          newBlocks.forEach((block, index) => {
            editor.insertBlock('Paragraph', {
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
