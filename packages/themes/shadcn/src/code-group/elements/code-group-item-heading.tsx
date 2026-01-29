import { CodeGroupCommands } from '@yoopta/code';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import { X } from 'lucide-react';
import { Transforms } from 'slate';

import { TabsTrigger } from '../../ui/tabs';

export const CodeGroupItemHeading = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();

  const deleteTabItem = () => {
    if (editor.readOnly) return;
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    const elementPath = Elements.getElementPath(editor, { blockId, element });
    if (!elementPath) return;

    Transforms.select(slate, elementPath);
    CodeGroupCommands.deleteTabItem(editor, blockId, { tabId: element.id });
  };

  return (
    <TabsTrigger
      {...attributes}
      value={element.id}
      className="relative group/tab flex items-center gap-1.5 px-3 h-7 rounded-none rounded-t-lg border-b-2 border-transparent whitespace-nowrap text-xs font-normal transition-colors"
      style={{
        backgroundColor: 'var(--code-group-tab-inactive-bg, hsl(var(--muted)))',
        color: 'var(--code-group-tab-inactive-fg, hsl(var(--muted-foreground)))',
      }}>
      <div className="flex-1 min-w-0">{children}</div>
      {!editor.readOnly && (
        <span
          contentEditable={false}
          onClick={deleteTabItem}
          className="ml-1 flex items-center justify-center rounded-sm opacity-0 group-hover/tab:opacity-100 transition-opacity hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-0.5"
          style={{
            color: 'inherit',
          }}
          title="Close tab">
          <X className="h-3 w-3 shrink-0" />
        </span>
      )}
    </TabsTrigger>
  );
};
