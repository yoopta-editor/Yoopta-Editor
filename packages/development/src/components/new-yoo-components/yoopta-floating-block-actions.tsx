import { useRef, useState } from 'react';
import { DragHandleDots2Icon, PlusIcon } from '@radix-ui/react-icons';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { FloatingBlockActions, useFloatingBlockActions } from '@yoopta/ui/floating-block-actions';

import { YooptaBlockOptions } from './yoopta-block-options';

export const YooptaFloatingBlockActions = () => {
  const editor = useYooptaEditor();
  const dragHandleRef = useRef<HTMLButtonElement>(null);

  // State for controlling BlockOptions
  const [blockOptionsOpen, setBlockOptionsOpen] = useState(false);

  return (
    <FloatingBlockActions.Root>
      <FloatingBlockActionsContent
        editor={editor}
        dragHandleRef={dragHandleRef}
        blockOptionsOpen={blockOptionsOpen}
        setBlockOptionsOpen={setBlockOptionsOpen}
      />
    </FloatingBlockActions.Root>
  );
};

// Inner component that can use the context
type FloatingBlockActionsContentProps = {
  editor: ReturnType<typeof useYooptaEditor>;
  dragHandleRef: React.RefObject<HTMLButtonElement>;
  blockOptionsOpen: boolean;
  setBlockOptionsOpen: (open: boolean) => void;
};

const FloatingBlockActionsContent = ({
  editor,
  dragHandleRef,
  blockOptionsOpen,
  setBlockOptionsOpen,
}: FloatingBlockActionsContentProps) => {
  const { blockId, toggle } = useFloatingBlockActions();

  const onPlusClick = () => {
    if (!blockId) return;
    const floatingBlock = Blocks.getBlock(editor, { id: blockId });
    if (!floatingBlock) return;

    const nextOrder = floatingBlock.meta.order + 1;
    editor.insertBlock('Paragraph', { at: nextOrder, focus: true });
  };

  const onDragClick = () => {
    if (!blockId) return;
    setBlockOptionsOpen(true);
    toggle('frozen', blockId);
  };

  const onBlockOptionsChange = (open: boolean) => {
    setBlockOptionsOpen(open);
    if (!open) {
      toggle('hovering');
    }
  };

  return (
    <>
      <FloatingBlockActions.Button onClick={onPlusClick} title="Add block">
        <PlusIcon />
      </FloatingBlockActions.Button>
      <FloatingBlockActions.Button ref={dragHandleRef} onClick={onDragClick} title="Block options">
        <DragHandleDots2Icon />
      </FloatingBlockActions.Button>

      <YooptaBlockOptions
        open={blockOptionsOpen}
        onOpenChange={onBlockOptionsChange}
        blockId={blockId}
        anchor={dragHandleRef.current}
      />
    </>
  );
};
