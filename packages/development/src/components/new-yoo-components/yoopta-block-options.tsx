import { BlockOptions, useActionMenuListActions } from '@yoopta/ui';
import { useBlockOptions, useBlockOptionsActions, useFloatingBlockActions } from '@yoopta/ui';

export const YooptaBlockOptions = () => {
  const { toggle: toggleFloatingBlockActions, floatingBlockId } = useFloatingBlockActions();
  const { duplicateBlock, copyBlockLink, deleteBlock } = useBlockOptionsActions();
  const { isOpen, getRootProps, close } = useBlockOptions();
  const { open: openActionMenuList, close: closeActionMenuList } = useActionMenuListActions();

  const onTurnInto = (e: React.MouseEvent) => {
    if (!floatingBlockId) return;

    openActionMenuList({
      reference: e.currentTarget as HTMLElement,
      view: 'small',
      placement: 'right',
      blockId: floatingBlockId,
    });
  };

  const onDuplicateBlock = () => {
    if (!floatingBlockId) return;

    duplicateBlock(floatingBlockId);
    toggleFloatingBlockActions('hovering');
  };

  const onCopyBlockLink = () => {
    if (!floatingBlockId) return;

    copyBlockLink(floatingBlockId);
    toggleFloatingBlockActions('hovering');
  };

  const onDeleteBlock = () => {
    if (!floatingBlockId) return;

    deleteBlock(floatingBlockId);
    toggleFloatingBlockActions('hovering');
  };

  const onClose = () => {
    closeActionMenuList();
    toggleFloatingBlockActions('hovering');
    close();
  };

  if (!isOpen) return null;

  return (
    <BlockOptions.Root {...getRootProps()} onClose={onClose}>
      <BlockOptions.Group>
        <BlockOptions.Button onClick={onTurnInto}>Turn into</BlockOptions.Button>
      </BlockOptions.Group>
      <BlockOptions.Separator />
      <BlockOptions.Group>
        <BlockOptions.Button onClick={onDuplicateBlock}>Duplicate</BlockOptions.Button>
        <BlockOptions.Button onClick={onCopyBlockLink}>Copy link to block</BlockOptions.Button>
        <BlockOptions.Button onClick={onDeleteBlock}>Delete</BlockOptions.Button>
      </BlockOptions.Group>
    </BlockOptions.Root>
  );
};
