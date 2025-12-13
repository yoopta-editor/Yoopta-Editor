import type { PluginElementRenderProps } from '@yoopta/editor';

export const HeadingOneRender = (props: PluginElementRenderProps) => {
  const { element, attributes, children } = props;

  return (
    <h1 id={element.id} draggable={false} {...attributes}>
      {children}
    </h1>
  );
};
