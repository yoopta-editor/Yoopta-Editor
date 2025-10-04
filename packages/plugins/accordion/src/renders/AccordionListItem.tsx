import type { PluginElementRenderProps } from '@yoopta/editor';

export const AccordionListItem = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { attributes, children } = props;

  if (extendRender) return extendRender(props);

  return (
    <div {...attributes} className="yoo-accordion-border-b">
      {children}
    </div>
  );
};
