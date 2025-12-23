import { useCallback } from 'react';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { X } from 'lucide-react';
import { Editor, Element, Transforms } from 'slate';

import { TabsTrigger } from '../../ui/tabs';

export const TabsItemHeading = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();

  const deleteTabItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      Transforms.removeNodes(slate, {
        at: [0],
        match: (n) =>
          Element.isElement(n) &&
          n.type === 'tabs-item-content' &&
          n.props?.referenceId === element.id,
      });

      Transforms.removeNodes(slate, {
        match: (n) =>
          Element.isElement(n) &&
          (n as SlateElement).type === 'tabs-item-heading' &&
          (n as SlateElement).id === element.id,
      });
    });
  };

  return (
    <TabsTrigger
      {...attributes}
      value={element.id}
      className="relative group/tab flex items-center gap-2 pr-8">
      <div className="flex-1 min-w-0">{children}</div>
      <span
        contentEditable={false}
        onClick={deleteTabItem}
        className="absolute right-1 flex items-center justify-center rounded-sm opacity-0 group-hover/tab:opacity-100 transition-opacity hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-1"
        title="Close tab">
        <X className="h-3 w-3 shrink-0 text-muted-foreground" />
      </span>
    </TabsTrigger>
  );
};
