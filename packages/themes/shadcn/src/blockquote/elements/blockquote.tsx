import type { PluginElementRenderProps } from '@yoopta/editor';

export const Blockquote = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <blockquote {...attributes} className="mt-4 border-l-2 pl-6 leading-7">
      {children}
    </blockquote>
  );
};
