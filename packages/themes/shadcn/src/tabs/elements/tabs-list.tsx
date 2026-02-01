import type { PluginElementRenderProps } from '@yoopta/editor';
import { useYooptaEditor } from '@yoopta/editor';
import { TabsCommands } from '@yoopta/tabs';
import { Plus } from 'lucide-react';

import { ScrollArea, ScrollBar } from '../../ui/scroll-area';
import { TabsList } from '../../ui/tabs';

export const TabsListElement = (props: PluginElementRenderProps) => {
  const { attributes, children, blockId } = props;
  const editor = useYooptaEditor();

  const addTabItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    TabsCommands.addTabItem(editor, blockId);
  };

  return (
    <ScrollArea className="w-full">
      <TabsList {...attributes} className="w-full relative justify-start">
        {children}
        {!editor.readOnly && (
          <button
            type="button"
            contentEditable={false}
            onClick={addTabItem}
            className="ml-1 flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-1.5"
            title="Add tab">
            <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        )}
      </TabsList>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
