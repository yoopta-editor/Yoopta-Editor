import { Cross1Icon } from '@radix-ui/react-icons';
import { Elements, PluginElementRenderProps, useYooptaEditor } from '@yoopta/editor';
import { TabListItemElement } from './types';

export const TabsListItemTitle = (props: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const parentPath = Elements.getParentElementPath(editor, props.blockId, props.element);
  const parentElement = Elements.getElement(editor, props.blockId, {
    path: parentPath,
    type: 'tabs-list-item',
  }) as TabListItemElement;

  const isItemActive = parentElement?.props?.active;

  return (
    <h4 {...props.attributes} className="leading-6">
      <div className="flex items-center gap-1">
        <span
          style={{ color: isItemActive ? '#16a34a' : undefined }}
          className="font-semibold text-sm whitespace-pre p-0 m-0 bg-transparent focus:outline-none focus:ring-0 border-none min-w-[50px] pl-2"
        >
          {props.children}
        </span>
        <button type="button" className="p-0 m-0 ml-1">
          <Cross1Icon className="lucide lucide-x w-3 h-3" />
        </button>
      </div>
    </h4>
  );
};
