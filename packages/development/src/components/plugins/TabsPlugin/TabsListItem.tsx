import { Elements, PluginElementRenderProps, useYooptaEditor } from '@yoopta/editor';
import { CrossIcon } from 'lucide-react';
import { TabListItemElement } from './types';

export const TabsListItem = (props: PluginElementRenderProps) => {
  const editor = useYooptaEditor();

  const isActive = props.element.props.active;

  return (
    <li
      className="shrink-0 z-10 max-w-max text-sm font-semibold pt-3 pb-2.5 -mb-px border-b cursor-pointer text-zinc-900 border-transparent hover:border-zinc-300 dark:text-zinc-200 dark:hover:border-zinc-700"
      {...props.attributes}
    >
      {props.children}
    </li>
  );
};
