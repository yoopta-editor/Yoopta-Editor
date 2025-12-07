import type { PluginElementRenderProps } from '@yoopta/editor';
import React from 'react';

import { AccordionTrigger } from '../ui/accordion';

export const AccordionItemHeading = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <AccordionTrigger {...attributes} className="px-5">
      {children}
    </AccordionTrigger>
  );
};
