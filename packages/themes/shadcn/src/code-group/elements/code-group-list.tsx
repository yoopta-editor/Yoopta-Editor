import { CodeGroupCommands } from '@yoopta/code';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { useYooptaEditor } from '@yoopta/editor';
import { Plus } from 'lucide-react';

import { ScrollArea, ScrollBar } from '../../ui/scroll-area';
import { TabsList } from '../../ui/tabs';

export const CodeGroupList = (props: PluginElementRenderProps) => {
  const { attributes, children, blockId } = props;
  const editor = useYooptaEditor();

  const addTabItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    CodeGroupCommands.addTabItem(editor, blockId);
  };

  return (
    <ScrollArea className="w-full">
      <TabsList
        {...attributes}
        className="w-full relative justify-start h-8 rounded-none rounded-t-lg bg-transparent p-0 border-b border-x-0 border-t-0"
        style={{
          backgroundColor: 'var(--code-group-tab-inactive-bg)',
          borderBottomColor: 'var(--code-group-tab-border)',
        }}>
        {children}
        <button
          type="button"
          contentEditable={false}
          onClick={addTabItem}
          className="ml-1 flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-1.5 h-7"
          style={{
            color: 'var(--code-group-tab-inactive-fg)',
          }}
          title="Add tab">
          <Plus className="h-3.5 w-3.5 shrink-0" />
        </button>
      </TabsList>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
