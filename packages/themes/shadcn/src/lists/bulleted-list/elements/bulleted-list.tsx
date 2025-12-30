import type { PluginElementRenderProps } from '@yoopta/editor';

export const BulletedList = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <ul {...attributes} className="my-6 ml-6 list-disc [&>li]:mt-2">
      {children}
    </ul>
  );
};
