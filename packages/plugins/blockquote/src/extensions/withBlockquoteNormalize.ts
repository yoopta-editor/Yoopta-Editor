import { Editor, Element, Transforms } from 'slate';
import { SlateEditor, YooEditor } from '@yoopta/editor';

export function withBlockquoteNormalize(slate: SlateEditor, editor: YooEditor) {
  const { normalizeNode } = slate;

  slate.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (path.length === 0 && Editor.isEditor(node)) {
      const blockquoteElements = node.children.filter(
        (child) => Element.isElement(child) && child.type === 'blockquote',
      );

      if (blockquoteElements.length > 1 && editor.path.current !== null) {
        const currentPath = editor.path.current;

        const firstBlockquoteIndex = node.children.findIndex(
          (child) => Element.isElement(child) && child.type === 'blockquote',
        );

        if (firstBlockquoteIndex === -1) return;

        const newBlocks = blockquoteElements
          .slice(1)
          .map((blockquote) => {
            if (Element.isElement(blockquote)) {
              return {
                id: blockquote.id,
                type: 'Blockquote',
                value: [blockquote],
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
          if (Element.isElement(child) && child.type === 'blockquote' && i !== firstBlockquoteIndex) {
            Transforms.removeNodes(slate, { at: [i] });
          }
        }

        editor.batchOperations(() => {
          newBlocks.forEach((block, index) => {
            editor.insertBlock('Blockquote', {
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
