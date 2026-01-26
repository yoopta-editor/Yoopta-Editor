import { useRef, useState } from 'react';
import { BlockOptions, useBlockActions } from '@yoopta/ui/block-options';
import { ActionMenuList } from '@yoopta/ui/action-menu-list';

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
  const turnIntoRef = useRef<HTMLButtonElement>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);

  const onTurnInto = () => {
    setActionMenuOpen(true);
  };

  const onActionMenuClose = (menuOpen: boolean) => {
    setActionMenuOpen(menuOpen);
    // When action menu closes after selection, also close block options
    if (!menuOpen) {
      onOpenChange?.(false);
    }
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
    <>
      <BlockOptions open={open} onOpenChange={onOpenChange} anchor={anchor}>
        <BlockOptions.Content side="right" align="end">
          <BlockOptions.Group>
            <BlockOptions.Item ref={turnIntoRef} onSelect={onTurnInto} keepOpen>
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

      {/* ActionMenuList positioned next to "Turn into" button */}
      <ActionMenuList
        open={actionMenuOpen}
        onOpenChange={onActionMenuClose}
        anchor={turnIntoRef.current}
        blockId={blockId}
        view="small"
        placement="right-start"
      >
        <ActionMenuList.Content />
      </ActionMenuList>
    </>
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
