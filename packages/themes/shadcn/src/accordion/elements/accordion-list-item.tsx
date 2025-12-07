import type { PluginElementRenderProps } from '@yoopta/editor';
import React from 'react';

import { AccordionItem } from '../ui/accordion';

export const AccordionListItem = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  return (
    <AccordionItem value={element.id} {...attributes}>
      {children}
    </AccordionItem>
  );
};
