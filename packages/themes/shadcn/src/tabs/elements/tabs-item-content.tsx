import { useMemo } from 'react';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import { Editor, Element } from 'slate';

import { TabsContent } from '../../ui/tabs';

export const TabsItemContent = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();

  // Find index of this content in tabs-container (after tabs-list)
  const contentIndex = useMemo(() => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return undefined;

    try {
      const elementPath = Elements.getElementPath(editor, blockId, element as SlateElement);
      if (!elementPath) return undefined;

      const containerEntry = Editor.parent(slate, elementPath);
      const containerPath = containerEntry[1];

      // Find all content elements in container
      const contentNodes = Editor.nodes<SlateElement>(slate, {
        at: containerPath,
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-content',
      });

      let index = 0;
      for (const [node] of contentNodes) {
        if (node.id === element.id) {
          return index;
        }
        index += 1;
      }
    } catch (error) {
      // Element path not found
    }

    return undefined;
  }, [editor, blockId, element]);

  return (
    <TabsContent
      {...attributes}
      value={contentIndex !== undefined ? String(contentIndex) : '0'}
      className="mt-2">
      {children}
    </TabsContent>
  );
};
