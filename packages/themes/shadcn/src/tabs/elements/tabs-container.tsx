import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { Element, Transforms } from 'slate';

import { Tabs } from '../../ui/tabs';

export const TabsContainer = (props: PluginElementRenderProps) => {
  const { attributes, children, blockId, element } = props;
  const editor = useYooptaEditor();

  const onValueChange = (value: string) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Transforms.setNodes<SlateElement>(
      slate,
      { props: { ...element.props, activeTabId: value } },
      {
        at: [0],
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-container',
      },
    );
  };

  return (
    <Tabs
      {...attributes}
      value={element.props?.activeTabId}
      onValueChange={onValueChange}
      className="w-full">
      {children}
    </Tabs>
  );
};
