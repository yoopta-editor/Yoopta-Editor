import { DragHandleDots2Icon, MagicWandIcon, PlusIcon } from '@radix-ui/react-icons';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import {
  FloatingBlockActions,
  useSlashActionMenuActions,
  useBlockOptionsActions,
  useFloatingBlockActions,
} from '@yoopta/ui';

export const YooptaFloatingBlockActions = () => {
  const editor = useYooptaEditor();
  const { open: openBlockOptions } = useBlockOptionsActions();
  const { open: openSlashActionMenu } = useSlashActionMenuActions();
  const {
    toggle: toggleFloatingBlockActions,
    reference,
    floatingBlockId,
  } = useFloatingBlockActions();

  // Programmatic way to open the slash action menu
  const onPlusClick = (e: React.MouseEvent) => {
    if (!floatingBlockId) return;
    const floatingBlock = Blocks.getBlock(editor, { id: floatingBlockId });
    if (!floatingBlock) return;

    const nextOrder = floatingBlock.meta.order + 1;
    const nextBlockId = editor.insertBlock('Paragraph', { at: nextOrder, focus: true });

    // Wait for the block to be rendered, then get block element and open slash menu
    setTimeout(() => {
      const blockEl = document.querySelector(`[data-yoopta-block-id="${nextBlockId}"]`);
      if (!blockEl) return;

      openSlashActionMenu({
        getBoundingClientRect: () => blockEl.getBoundingClientRect(),
        getClientRects: () => blockEl.getClientRects(),
      } as HTMLElement);
    }, 0);
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
