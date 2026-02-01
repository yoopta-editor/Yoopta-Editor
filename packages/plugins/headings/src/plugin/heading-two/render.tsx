import type { PluginElementRenderProps } from '@yoopta/editor';

export const HeadingTwoRender = (props: PluginElementRenderProps) => {
  const { element, attributes, children } = props;

  return (
    <h2 id={element.id} draggable={false} {...attributes}>
      {children}
    </h2>
  );
};
