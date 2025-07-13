import { useYooptaEditor } from '@yoopta/editor';
import { useBlockOptionsContext } from './BlockOptionsContext';

type UseBlockOptionDefaultHandlersProps = {
  onCopy?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
};

export function useBlockOptionDefaultHandlers({
  onCopy,
  onDuplicate,
  onDelete,
}: UseBlockOptionDefaultHandlersProps = {}) {
  const editor = useYooptaEditor();
  const { close } = useBlockOptionsContext();

  const duplicateBlock = () => {
    if (typeof editor.path.current !== 'number') return;

    editor.duplicateBlock({ original: { path: editor.path.current }, focus: true });
    onDuplicate?.();
    close();
  };

  const copyLinkToBlock = () => {
    console.log('copyLinkToBlock');
    onCopy?.();
    close();
  };

  const deleteBlock = () => {
    if (typeof editor.path.current !== 'number') return;

    editor.deleteBlock({ at: editor.path.current });
    editor.setPath({ current: null });

    onDelete?.();
    close();
  };

  return {
    duplicateBlock,
    copyLinkToBlock,
    deleteBlock,
  };
}
