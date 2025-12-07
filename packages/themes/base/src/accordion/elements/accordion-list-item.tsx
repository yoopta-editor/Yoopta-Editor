import type { PluginElementRenderProps } from '@yoopta/editor';
import React from 'react';

export const AccordionListItem = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;
  const isExpanded = element.props?.isExpanded ?? false;

  return (
    <details {...attributes} open={isExpanded} className="yoopta-accordion-list-item">
      {children}
    </details>
  );
};
