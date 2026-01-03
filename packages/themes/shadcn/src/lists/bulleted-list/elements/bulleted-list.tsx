import type { PluginElementRenderProps } from '@yoopta/editor';

export const BulletedList = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <ul {...attributes} className="my-0 ml-6 list-disc [&>li]:mt-0">
      <li {...attributes} className="pl-2">
        {children}
      </li>
    </ul>
  );
};
