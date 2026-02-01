import type { PluginElementRenderProps } from '@yoopta/editor';

export const Paragraph = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <p {...attributes} className="leading-7 [&:not(:first-child)]:mt-6">
      {children}
    </p>
  );
};
