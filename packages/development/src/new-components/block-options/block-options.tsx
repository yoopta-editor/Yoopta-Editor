import {
  BlockOptions as BlockOptionsUI,
  BlockOptionsProvider,
  useBlockOptionsContext,
  useBlockOptionHandlers,
} from '@yoopta/ui/block-options';
import { EditIcon, Link2Icon, CopyIcon, TrashIcon } from 'lucide-react';

export const BlockOptions = () => {
  const { duplicateBlock, copyLinkToBlock, deleteBlock } = useBlockOptionHandlers();

  return (
    <BlockOptionsUI.Root>
      <BlockOptionsUI.Content>
        <BlockOptionsUI.Group>
          <BlockOptionsUI.Button icon={<EditIcon />} size="md">
            Turn into
          </BlockOptionsUI.Button>
          <BlockOptionsUI.Button icon={<CopyIcon />} size="md" onClick={duplicateBlock}>
            Duplicate block
          </BlockOptionsUI.Button>

          <BlockOptionsUI.Separator />
          <BlockOptionsUI.Button icon={<Link2Icon />} size="md" onClick={copyLinkToBlock}>
            Copy link to block
          </BlockOptionsUI.Button>
          <BlockOptionsUI.Button icon={<TrashIcon />} variant="destructive" size="md" onClick={deleteBlock}>
            Delete block
          </BlockOptionsUI.Button>
        </BlockOptionsUI.Group>
      </BlockOptionsUI.Content>
    </BlockOptionsUI.Root>
  );
};

export { BlockOptionsProvider, useBlockOptionsContext };
