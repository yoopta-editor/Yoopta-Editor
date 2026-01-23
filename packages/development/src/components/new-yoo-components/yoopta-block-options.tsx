import { BlockOptions, useBlockActions } from '@yoopta/ui/block-options';
import { useActionMenuListActions } from '@yoopta/ui/action-menu-list';

type YooptaBlockOptionsProps = {
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Block ID to operate on */
  blockId: string | null;
  /** Anchor element for positioning */
  anchor?: HTMLButtonElement | null;
};

export const YooptaBlockOptions = ({ open, onOpenChange, blockId, anchor }: YooptaBlockOptionsProps) => {
  const { duplicateBlock, copyBlockLink, deleteBlock } = useBlockActions();
  const { open: openActionMenuList } = useActionMenuListActions();

  const onTurnInto = (e: React.MouseEvent) => {
    if (!blockId) return;

    openActionMenuList({
      reference: e.currentTarget as HTMLElement,
      view: 'small',
      placement: 'right',
      blockId,
    });
  };

  const onDuplicate = () => {
    if (!blockId) return;
    duplicateBlock(blockId);
    onOpenChange?.(false);
  };

  const onCopyLink = () => {
    if (!blockId) return;
    copyBlockLink(blockId);
    onOpenChange?.(false);
  };

  const onDelete = () => {
    if (!blockId) return;
    deleteBlock(blockId);
    onOpenChange?.(false);
  };

  return (
    <BlockOptions open={open} onOpenChange={onOpenChange} anchor={anchor}>
      <BlockOptions.Content side="right" align="end">
        <BlockOptions.Group>
          <BlockOptions.Item onSelect={onTurnInto} keepOpen>
            Turn into
          </BlockOptions.Item>
        </BlockOptions.Group>
        <BlockOptions.Separator />
        <BlockOptions.Group>
          <BlockOptions.Item onSelect={onDuplicate}>Duplicate</BlockOptions.Item>
          <BlockOptions.Item onSelect={onCopyLink}>Copy link to block</BlockOptions.Item>
          <BlockOptions.Item variant="destructive" onSelect={onDelete}>
            Delete
          </BlockOptions.Item>
        </BlockOptions.Group>
      </BlockOptions.Content>
    </BlockOptions>
  );
};

/**
 * Example of uncontrolled usage with trigger
 */
export const YooptaBlockOptionsUncontrolled = ({ blockId }: { blockId: string }) => {
  const { duplicateBlock, deleteBlock } = useBlockActions();

  return (
    <BlockOptions>
      <BlockOptions.Trigger>
        <button>Open Options</button>
      </BlockOptions.Trigger>
      <BlockOptions.Content>
        <BlockOptions.Group>
          <BlockOptions.Item onSelect={() => duplicateBlock(blockId)}>Duplicate</BlockOptions.Item>
          <BlockOptions.Item variant="destructive" onSelect={() => deleteBlock(blockId)}>
            Delete
          </BlockOptions.Item>
        </BlockOptions.Group>
      </BlockOptions.Content>
    </BlockOptions>
  );
};
