import type { PluginElementRenderProps } from '@yoopta/editor';
import React from 'react';

export const AccordionItemHeading = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <summary {...attributes} className="yoopta-accordion-list-item-heading">
      {children}
    </summary>
  );
};
