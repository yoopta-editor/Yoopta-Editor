import React, { useRef, useState } from 'react';
import { DragHandleDots2Icon, PlusIcon } from '@radix-ui/react-icons';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { FloatingBlockActions } from '@yoopta/ui/floating-block-actions';
import { DragHandle } from '@yoopta/ui/block-dnd';

import { YooptaBlockOptions } from './block-options';

export const FloatingBlockActionsComponent = () => {
  const editor = useYooptaEditor();
  const dragHandleRef = useRef<HTMLButtonElement>(null);

  const [blockOptionsOpen, setBlockOptionsOpen] = useState(false);

  const onPlusClick = (blockId: string | null) => {
    if (!blockId) return;
    const floatingBlock = Blocks.getBlock(editor, { id: blockId });
    if (!floatingBlock) return;

    const nextOrder = floatingBlock.meta.order + 1;
    editor.insertBlock('Paragraph', { at: nextOrder, focus: true });
  };

  const onDragClick = (blockId: string | null) => {
    if (!blockId) return;
    const block = Blocks.getBlock(editor, { id: blockId });
    if (!block) return;
    editor.setPath({ current: block.meta.order });
    setBlockOptionsOpen(true);
  };

  const onBlockOptionsChange = (open: boolean) => {
    setBlockOptionsOpen(open);
  };

  return (
    <FloatingBlockActions frozen={blockOptionsOpen}>
      {({ blockId }) => (
        <>
          <FloatingBlockActions.Button onClick={() => onPlusClick(blockId)} title="Add block">
            <PlusIcon />
          </FloatingBlockActions.Button>
          <DragHandle blockId={blockId} ref={dragHandleRef} asChild>
            <FloatingBlockActions.Button onClick={() => onDragClick(blockId)} title="Block options">
              <DragHandleDots2Icon />
            </FloatingBlockActions.Button>
          </DragHandle>

          <YooptaBlockOptions
            open={blockOptionsOpen}
            onOpenChange={onBlockOptionsChange}
            blockId={blockId}
            anchor={dragHandleRef.current}
          />
        </>
      )}
    </FloatingBlockActions>
  );
};
