import type { PluginElementRenderProps } from '@yoopta/editor';

export const HeadingThreeRender = (props: PluginElementRenderProps) => {
  const { element, attributes, children } = props;

  return (
    <h3 id={element.id} draggable={false} {...attributes}>
      {children}
    </h3>
  );
};
