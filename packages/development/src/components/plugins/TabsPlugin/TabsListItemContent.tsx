import { PluginElementRenderProps } from '@yoopta/editor';

export const TabsListItemContent = (props: PluginElementRenderProps) => {
  return <div {...props.attributes}>{props.children}</div>;
};
