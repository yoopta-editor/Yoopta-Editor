import type { PluginElementRenderProps } from '@yoopta/editor';

export const HeadingTwo = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  return (
    <h2
      id={element.id}
      draggable={false}
      {...attributes}
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
};
