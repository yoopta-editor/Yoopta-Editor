import { useCallback, useEffect } from 'react';
import { useFloating, offset, flip, shift, autoUpdate, inline } from '@floating-ui/react';
import { useYooptaEditor } from '@yoopta/editor';
import { useBlockOptionsStore } from './store';

type UseBlockOptionsOpenOptions = {
  reference: HTMLElement;
  blockId?: string;
};

export const useBlockOptions = () => {
  const editor = useYooptaEditor();
  const blockOptionStore = useBlockOptionsStore();

  const isOpen = blockOptionStore.state === 'open';

  const { refs, floatingStyles, update } = useFloating({
    placement: 'right-start',
    open: isOpen,
    middleware: [inline(), flip(), shift(), offset({ mainAxis: 5 })],
    whileElementsMounted: autoUpdate,
    strategy: 'fixed',
  });

  useEffect(() => {
    refs.setReference(blockOptionStore.refs.reference);

    if (isOpen) update();
  }, [refs, blockOptionStore.refs.reference, isOpen]);

  const open = useCallback(
    ({ reference, blockId }: UseBlockOptionsOpenOptions) => {
      blockOptionStore.toggle('open', reference);
    },
    [blockOptionStore],
  );

  const close = useCallback(() => {
    blockOptionStore.toggle('closed', null);
  }, [blockOptionStore]);

  const duplicateBlock = useCallback(() => {
    if (typeof editor.path.current !== 'number') {
      close();
      return;
    }

    editor.duplicateBlock({ original: { path: editor.path.current }, focus: true });
    close();
  }, [editor, close]);

  const copyBlockLink = useCallback(() => {
    const blockId = null;
    if (!blockId) {
      close();
      return;
    }

    const block = editor.children[blockId];
    if (block) {
      const url = `${window.location.origin}${window.location.pathname}#${block.id}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          console.log('Block link copied to clipboard');
        });
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      editor.emit?.('block:copy', block);
    }

    close();
  }, [blockOptionStore, editor, close]);

  const deleteBlock = useCallback(() => {
    if (editor.path.current !== null) {
      editor.deleteBlock({ at: editor.path.current });
      editor.setPath({ current: null });
    }

    close();
  }, [editor, close]);

  const setFloatingRef = useCallback(
    (node: HTMLElement | null) => {
      refs.setFloating(node);
    },
    [blockOptionStore, refs],
  );

  return {
    isOpen,
    style: floatingStyles,
    setFloatingRef,
    open,
    close,
    duplicateBlock,
    copyBlockLink,
    deleteBlock,
  };
};
