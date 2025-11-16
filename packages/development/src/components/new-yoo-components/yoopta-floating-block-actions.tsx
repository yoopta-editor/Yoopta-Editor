import { DragHandleDots2Icon, MagicWandIcon, PlusIcon } from '@radix-ui/react-icons';
import { useYooptaEditor } from '@yoopta/editor';
import { FloatingBlockActions } from '@yoopta/ui';
import { useBlockOptionsActions, useFloatingBlockActions } from '@yoopta/ui';

export const YooptaFloatingBlockActions = () => {
  const editor = useYooptaEditor();
  const { open: openBlockOptions } = useBlockOptionsActions();
  const {
    toggle: toggleFloatingBlockActions,
    reference,
    floatingBlockId,
  } = useFloatingBlockActions();

  const onPlusClick = (e: React.MouseEvent) => {
    editor.insertBlock('Paragraph', { at: editor.path.current, focus: true });
  };

  const onDragClick = (e: React.MouseEvent) => {
    if (!floatingBlockId) return;
    openBlockOptions({ reference: reference as HTMLElement, blockId: floatingBlockId });
    toggleFloatingBlockActions('frozen', floatingBlockId);
  };

  return (
    <FloatingBlockActions.Root>
      <FloatingBlockActions.Button onClick={onPlusClick}>
        <PlusIcon />
      </FloatingBlockActions.Button>
      <FloatingBlockActions.Button onClick={onDragClick}>
        <DragHandleDots2Icon />
      </FloatingBlockActions.Button>
      <FloatingBlockActions.Button onClick={onDragClick}>
        <MagicWandIcon />
      </FloatingBlockActions.Button>
    </FloatingBlockActions.Root>
  );
};
