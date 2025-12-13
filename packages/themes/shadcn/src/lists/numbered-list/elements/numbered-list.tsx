import type { PluginElementRenderProps } from '@yoopta/editor';

export const NumberedList = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <ol {...attributes} className="my-6 ml-6 list-decimal [&>li]:mt-2">
      {children}
    </ol>
  );
};
