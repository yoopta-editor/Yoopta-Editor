import type { PluginElementRenderProps } from '@yoopta/editor';

export const HeadingThree = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  return (
    <h3
      id={element.id}
      draggable={false}
      {...attributes}
      className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  );
};
