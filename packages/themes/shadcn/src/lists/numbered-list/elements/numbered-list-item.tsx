import type { PluginElementRenderProps } from '@yoopta/editor';

export const NumberedListItem = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <li {...attributes} className="pl-2">
      {children}
    </li>
  );
};
