import type { PluginElementRenderProps } from '@yoopta/editor';

export const HeadingTwo = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  return (
    <h2
      id={element.id}
      draggable={false}
      {...attributes}
      className="mt-6 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors">
      {children}
    </h2>
  );
};
