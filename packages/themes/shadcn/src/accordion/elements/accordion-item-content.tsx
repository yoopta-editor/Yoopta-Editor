import type { PluginElementRenderProps } from '@yoopta/editor';
import React from 'react';

import { AccordionContent } from '../ui/accordion';

export const AccordionItemContent = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <AccordionContent {...attributes} className="text-muted-foreground px-5">
      {children}
    </AccordionContent>
  );
};
