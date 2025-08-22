import { useYooptaEditor } from '@yoopta/editor';
import {
  BlockOptions as BlockOptionsUI,
  BlockOptionsProvider,
  useBlockOptionsContext,
  useBlockOptionHandlers,
  useActionMenu,
} from '@yoopta/ui';
import { EditIcon, Link2Icon, CopyIcon, TrashIcon } from 'lucide-react';

export const BlockOptions = () => {
  const { duplicateBlock, copyLinkToBlock, deleteBlock } = useBlockOptionHandlers();
  const editor = useYooptaEditor();

  const { open, isOpen, close } = useActionMenu({
    editor,
    trigger: '/',
    mode: 'toggle',
  });

  const toggleActionMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isOpen) {
      close();
    } else {
      console.log('BlockOptions editor.path.current', editor.path.current);
      // editor.setPath({ current: editor.path.current });
      open(e.currentTarget);
    }
  };

  return (
    <BlockOptionsUI.Root>
      <BlockOptionsUI.Content>
        <BlockOptionsUI.Group>
          <BlockOptionsUI.Button icon={<EditIcon />} size="md" onClick={toggleActionMenu}>
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
