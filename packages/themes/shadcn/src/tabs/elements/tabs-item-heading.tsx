import { useCallback, useMemo } from 'react';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import { X } from 'lucide-react';
import { Editor, Element, Transforms } from 'slate';

import { TabsTrigger } from '../../ui/tabs';

export const TabsItemHeading = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();

  // Find index of this heading in tabs-list
  const { headingIndex, headingPath, tabsListPath } = useMemo(() => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return { headingIndex: undefined, headingPath: undefined, tabsListPath: undefined };

    try {
      const elementPath = Elements.getElementPath(editor, blockId, element as SlateElement);
      if (!elementPath)
        return { headingIndex: undefined, headingPath: undefined, tabsListPath: undefined };

      const parentEntry = Editor.parent(slate, elementPath);
      const listPath = parentEntry[1];

      // Find all headings in tabs-list to get index
      const headingNodes = Editor.nodes<SlateElement>(slate, {
        at: listPath,
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-heading',
      });

      let index = 0;
      for (const [node, path] of headingNodes) {
        if (node.id === element.id) {
          return { headingIndex: index, headingPath: path, tabsListPath: listPath };
        }
        index += 1;
      }
    } catch (error) {
      // Element path not found
    }

    return { headingIndex: undefined, headingPath: undefined, tabsListPath: undefined };
  }, [editor, blockId, element]);

  const deleteTabItem = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!headingPath || !tabsListPath || headingIndex === undefined) return;

      const slate = Blocks.getBlockSlate(editor, { id: blockId });
      if (!slate) return;

      // Find all headings in tabs-list
      const headingNodes = Editor.nodes<SlateElement>(slate, {
        at: tabsListPath,
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-heading',
      });

      const headings = Array.from(headingNodes);

      if (headings.length === 1) {
        Blocks.deleteBlock(editor, { blockId });
        return;
      }

      // Find corresponding content in tabs-container
      const containerNodes = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-container',
      });

      const containerEntry = Array.from(containerNodes)[0];
      if (!containerEntry) return;

      const [, containerPath] = containerEntry;

      // Find all content elements
      const contentNodes = Editor.nodes<SlateElement>(slate, {
        at: containerPath,
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-content',
      });

      const contents = Array.from(contentNodes);

      Editor.withoutNormalizing(slate, () => {
        // Delete heading
        Transforms.removeNodes(slate, {
          at: headingPath,
          match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-heading',
        });

        // Delete corresponding content by index
        if (headingIndex < contents.length && contents[headingIndex]) {
          const [, contentPath] = contents[headingIndex];
          Transforms.removeNodes(slate, {
            at: contentPath,
            match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-content',
          });
        }
      });
    },
    [editor, blockId, headingPath, tabsListPath, headingIndex],
  );

  return (
    <TabsTrigger
      {...attributes}
      value={headingIndex !== undefined ? String(headingIndex) : '0'}
      className="relative group/tab flex items-center gap-2 pr-8">
      <div className="flex-1 min-w-0">{children}</div>
      <span
        contentEditable={false}
        onClick={deleteTabItem}
        className="absolute right-1 flex items-center justify-center rounded-sm opacity-0 group-hover/tab:opacity-100 transition-opacity hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-1"
        title="Close tab">
        <X className="h-3 w-3 shrink-0 text-muted-foreground" />
      </span>
    </TabsTrigger>
  );
};
