import { useMemo } from 'react';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { Editor, Element, Transforms } from 'slate';

import { Accordion } from '../ui/accordion';

export const AccordionList = (props: PluginElementRenderProps) => {
  const { attributes, children, blockId } = props;
  const editor = useYooptaEditor();

  const expandedValue = useMemo(() => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return [];

    const expandedIds: string[] = [];

    // Find all accordion-list-item elements
    const itemNodes = Editor.nodes<SlateElement>(slate, {
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'accordion-list-item',
    });

    for (const [node] of itemNodes) {
      const itemElement = node as SlateElement;
      if (itemElement.props?.isExpanded && itemElement.id) {
        expandedIds.push(itemElement.id as string);
      }
    }

    return expandedIds;
  }, [editor, blockId]);

  const onValueChange = (value: string[]) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });

    if (!slate) return;

    // Find all accordion-list-item elements
    const itemNodes = Editor.nodes<SlateElement>(slate, {
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'accordion-list-item',
    });

    Editor.withoutNormalizing(slate, () => {
      for (const [node, path] of itemNodes) {
        const itemElement = node as SlateElement;
        const itemId = itemElement.id as string;
        const shouldBeExpanded = value.includes(itemId);

        if (itemElement.props?.isExpanded !== shouldBeExpanded) {
          Transforms.setNodes<SlateElement>(
            slate,
            { props: { ...itemElement.props, isExpanded: shouldBeExpanded } },
            { at: path },
          );
        }
      }
    });
  };

  return (
    <Accordion
      {...attributes}
      type="multiple"
      value={expandedValue}
      onValueChange={onValueChange}
      className="w-full rounded-md border">
      {children}
    </Accordion>
  );
};
