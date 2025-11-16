import { BlockOptions } from '@yoopta/ui';
import { useBlockOptions, useBlockOptionsActions, useFloatingBlockActions } from '@yoopta/ui';

export const YooptaBlockOptions = () => {
  const { toggle: toggleFloatingBlockActions, floatingBlockId } = useFloatingBlockActions();
  const { duplicateBlock, copyBlockLink, deleteBlock } = useBlockOptionsActions();
  const { isOpen, getRootProps, close } = useBlockOptions();

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

  console.log('YooptaBlockOptions isOpen', isOpen);
  if (!isOpen) return null;

  return (
    <BlockOptions.Root {...getRootProps()} onClose={() => close()}>
      <BlockOptions.Group>
        <BlockOptions.Button onClick={onDuplicateBlock}>Duplicate</BlockOptions.Button>
        <BlockOptions.Button onClick={onCopyBlockLink}>Copy link to block</BlockOptions.Button>
        <BlockOptions.Button onClick={onDeleteBlock}>Delete</BlockOptions.Button>
      </BlockOptions.Group>
    </BlockOptions.Root>
  );
};
