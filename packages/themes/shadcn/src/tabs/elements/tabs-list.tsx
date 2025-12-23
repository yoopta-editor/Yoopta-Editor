import { useCallback, useMemo } from 'react';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import { Plus } from 'lucide-react';
import { Editor, Element, Transforms } from 'slate';

import { TabsList } from '../../ui/tabs';

export const TabsListElement = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();

  // Find tabs-list path and active tab index
  const { tabsListPath, activeIndex, containerPath } = useMemo(() => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate)
      return { tabsListPath: undefined, activeIndex: undefined, containerPath: undefined };

    try {
      const elementPath = Elements.getElementPath(editor, blockId, element as SlateElement);
      if (!elementPath)
        return { tabsListPath: undefined, activeIndex: undefined, containerPath: undefined };

      const listPath = elementPath;

      // Find container
      const containerNodes = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-container',
      });

      const containerEntry = Array.from(containerNodes)[0];
      if (!containerEntry)
        return { tabsListPath: listPath, activeIndex: undefined, containerPath: undefined };

      const [, contPath] = containerEntry;

      // Find active heading
      const headingNodes = Editor.nodes<SlateElement>(slate, {
        at: listPath,
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-heading',
      });

      let index = 0;
      let activeIdx: number | undefined;
      for (const [node] of headingNodes) {
        if ((node as SlateElement).props?.isActive) {
          activeIdx = index;
          break;
        }
        index += 1;
      }

      return { tabsListPath: listPath, activeIndex: activeIdx, containerPath: contPath };
    } catch (error) {
      // Element path not found
    }

    return { tabsListPath: undefined, activeIndex: undefined, containerPath: undefined };
  }, [editor, blockId, element]);

  const addTabItem = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const slate = Blocks.getBlockSlate(editor, { id: blockId });
      if (!slate || !tabsListPath || !containerPath) return;

      // Find all headings to determine insert position
      const headingNodes = Editor.nodes<SlateElement>(slate, {
        at: tabsListPath,
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-heading',
      });

      const headings = Array.from(headingNodes);

      // Insert after active tab or at the end
      const insertIndex = activeIndex !== undefined ? activeIndex + 1 : headings.length;
      const nextHeadingPath = [...tabsListPath, insertIndex];

      // Find all content elements to get insert index
      const contentNodes = Editor.nodes<SlateElement>(slate, {
        at: containerPath,
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-content',
      });

      const contents = Array.from(contentNodes);
      const nextContentIndex = activeIndex !== undefined ? activeIndex + 1 : contents.length;
      const nextContentPath = [...containerPath, nextContentIndex + 1]; // +1 because tabs-list is at index 0

      Editor.withoutNormalizing(slate, () => {
        // Insert new heading
        const newHeading = editor.y('tabs-item-heading', {
          children: [editor.y.text('New Tab')],
          props: { isActive: true }, // Make new tab active
        });
        Transforms.insertNodes(slate, newHeading, { at: nextHeadingPath });

        // Insert new content
        const newContent = editor.y('tabs-item-content', {
          children: [editor.y.text('')],
        });
        Transforms.insertNodes(slate, newContent, { at: nextContentPath });

        // Deactivate all other headings
        const allHeadingNodes = Editor.nodes<SlateElement>(slate, {
          at: tabsListPath,
          match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-heading',
        });

        for (const [node, path] of allHeadingNodes) {
          const headingElement = node as SlateElement;
          if (headingElement.id !== newHeading.id && headingElement.props?.isActive) {
            Transforms.setNodes<SlateElement>(
              slate,
              { props: { ...headingElement.props, isActive: false } },
              { at: path },
            );
          }
        }

        const nextLeafPath = [...nextHeadingPath, 0];

        setTimeout(() => {
          Transforms.select(slate, { offset: 0, path: nextLeafPath });
        }, 0);
      });
    },
    [editor, blockId, tabsListPath, containerPath, activeIndex],
  );

  return (
    <TabsList {...attributes} className="w-full relative justify-start">
      {children}
      <button
        type="button"
        contentEditable={false}
        onClick={addTabItem}
        className="ml-1 flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-1.5"
        title="Add tab">
        <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>
    </TabsList>
  );
};
