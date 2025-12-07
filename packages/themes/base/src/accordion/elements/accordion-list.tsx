import type { PluginElementRenderProps } from '@yoopta/editor';
import React from 'react';

export const AccordionList = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <div {...attributes} className="yoopta-accordion-list">
      {children}
    </div>
  );
};
