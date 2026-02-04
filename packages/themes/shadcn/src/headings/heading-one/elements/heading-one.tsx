import type { PluginElementRenderProps } from '@yoopta/editor';

export const HeadingOne = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  return (
    <h1
      id={element.id}
      draggable={false}
      {...attributes}
      className="mt-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
};
