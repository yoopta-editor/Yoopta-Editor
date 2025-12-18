import type { PluginElementRenderProps } from '@yoopta/editor';

import { AccordionItem } from '../../ui/accordion';

export const AccordionListItem = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  return (
    <AccordionItem
      value={element.id}
      data-state={element.props?.isExpanded ? 'open' : 'closed'}
      {...attributes}>
      {children}
    </AccordionItem>
  );
};
