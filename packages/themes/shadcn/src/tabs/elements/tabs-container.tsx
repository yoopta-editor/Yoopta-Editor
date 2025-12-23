import { useMemo } from 'react';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { Editor, Element, Transforms } from 'slate';

import { Tabs } from '../../ui/tabs';

export const TabsContainer = (props: PluginElementRenderProps) => {
  const { attributes, children, blockId, element } = props;
  const editor = useYooptaEditor();

  // Find tabs-list and get all headings
  const { tabsList, headings } = useMemo(() => {
    const list = element.children.find(
      (child): child is SlateElement =>
        Element.isElement(child) && (child as SlateElement).type === 'tabs-list',
    ) as SlateElement | undefined;

    const heads =
      list?.children.filter(
        (child): child is SlateElement =>
          Element.isElement(child) && (child as SlateElement).type === 'tabs-item-heading',
      ) ?? [];

    return { tabsList: list, headings: heads as SlateElement[] };
  }, [element]);

  // Find active tab index (first heading with isActive prop or first heading)
  const activeValue = useMemo(() => {
    if (headings.length === 0) return undefined;

    const activeHeading = headings.find((heading) => heading.props?.isActive) as
      | SlateElement
      | undefined;

    if (activeHeading) {
      const activeIndex = headings.findIndex((h) => h.id === activeHeading.id);
      return activeIndex >= 0 ? String(activeIndex) : undefined;
    }

    // Default to first tab
    return '0';
  }, [headings]);

  const onValueChange = (value: string) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate || !tabsList) return;

    const activeIndex = parseInt(value, 10);
    if (Number.isNaN(activeIndex)) return;

    // Find all tabs-item-heading elements within tabs-list
    const headingNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-heading',
    });

    Editor.withoutNormalizing(slate, () => {
      let index = 0;
      for (const [node, path] of headingNodes) {
        const headingElement = node as SlateElement;
        const shouldBeActive = index === activeIndex;

        if (headingElement.props?.isActive !== shouldBeActive) {
          Transforms.setNodes<SlateElement>(
            slate,
            { props: { ...headingElement.props, isActive: shouldBeActive } },
            { at: path },
          );
        }
        index += 1;
      }
    });
  };

  return (
    <Tabs {...attributes} value={activeValue} onValueChange={onValueChange} className="w-full">
      {children}
    </Tabs>
  );
};
