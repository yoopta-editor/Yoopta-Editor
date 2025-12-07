import React, { useMemo } from 'react';
import { Elements, useYooptaEditor } from '@yoopta/editor';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';

import { Accordion } from '../ui/accordion';

export const AccordionList = (props: PluginElementRenderProps) => {
  const { attributes, children, blockId } = props;
  const editor = useYooptaEditor();

  const accordionItems = Elements.getElementChildren(editor, blockId, {
    type: 'accordion-list',
  });

  const expandedValue = useMemo(() => {
    if (!accordionItems) return undefined;

    for (const item of accordionItems) {
      if (
        'props' in item &&
        item.props &&
        typeof item.props === 'object' &&
        (item as SlateElement).props?.isExpanded &&
        'id' in item
      ) {
        return (item as SlateElement).id as string;
      }
    }
    return undefined;
  }, [accordionItems]);

  const onValueChange = (value: string | undefined) => {
    if (!accordionItems) return;

    accordionItems.forEach((item) => {
      if (!('id' in item)) return;

      const itemId = (item as SlateElement).id as string;
      const shouldBeExpanded = itemId === value;

      const itemEntry = Elements.getElementEntry(editor, blockId, {
        type: 'accordion-list-item',
        id: itemId,
      });

      if (itemEntry) {
        const [, itemPath] = itemEntry;
        Elements.updateElement(
          editor,
          blockId,
          { type: 'accordion-list-item', props: { isExpanded: shouldBeExpanded } },
          { path: itemPath },
        );
      }
    });
  };

  return (
    <Accordion
      {...attributes}
      type="single"
      collapsible
      value={expandedValue}
      onValueChange={onValueChange}
      className="w-full rounded-md border"
      defaultValue="item-1">
      {children}
    </Accordion>
  );
};
