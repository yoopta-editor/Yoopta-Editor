import { useCallback } from 'react';
import { generateId, PluginElementRenderProps } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { Plus } from 'lucide-react';

import { TabsList } from '../../ui/tabs';
import { Transforms } from 'slate';

export const TabsListElement = (props: PluginElementRenderProps) => {
  const { attributes, children, blockId } = props;
  const editor = useYooptaEditor();

  const addTabItem = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const slate = Blocks.getBlockSlate(editor, { id: blockId });
      if (!slate) return;

      const newTabId = generateId();

      // const newTabItem = editor.y('tabs-item-heading', {
      //   id: newTabId,
      //   children: [editor.y.text('New Tab')],
      // });

      // Transforms.insertNodes(slate, newTabItem, { at: [0] });
    },
    [editor, blockId],
  );

  return (
    <TabsList {...attributes} className="w-full relative justify-start">
      {children}
      <button
        type="button"
        contentEditable={false}
        onClick={addTabItem}
        className="ml-1 flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-1.5"
        title="Add tab">
        <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>
    </TabsList>
  );
};
