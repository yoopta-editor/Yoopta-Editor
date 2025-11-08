import { useCallback, useEffect } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  inline,
  useTransitionStyles,
} from '@floating-ui/react';
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

  const { refs, floatingStyles, context, update } = useFloating({
    placement: 'right-start',
    open: isOpen,
    middleware: [inline(), flip(), shift(), offset({ mainAxis: 5 })],
    whileElementsMounted: autoUpdate,
    strategy: 'fixed',
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 150,
  });

  useEffect(() => {
    refs.setReference(blockOptionStore.refs.reference);

    if (isOpen) update();
  }, [refs, blockOptionStore.refs.reference, isOpen]);

  const open = useCallback(
    ({ reference, blockId }: UseBlockOptionsOpenOptions) => {
      blockOptionStore.toggle('open', reference, blockId);
    },
    [blockOptionStore],
  );

  const close = useCallback(() => {
    blockOptionStore.toggle('closed', null);
  }, [blockOptionStore]);

  const duplicateBlock = useCallback(
    (blockId: string) => {
      if (!blockId) {
        throw new Error('Block ID is required to duplicate block');
      }

      editor.duplicateBlock({ original: { blockId }, focus: true });
      close();
    },
    [editor, close],
  );

  const copyBlockLink = useCallback(
    (blockId) => {
      if (!blockId) {
        throw new Error('Block ID is required to duplicate block');
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
    },
    [blockOptionStore, editor, close],
  );

  const deleteBlock = useCallback(
    (blockId: string | null) => {
      if (!blockId) {
        throw new Error('Block ID is required to delete block');
      }

      editor.deleteBlock({ blockId });
      editor.setPath({ current: null });

      close();
    },
    [editor, close],
  );

  const setFloatingRef = useCallback(
    (node: HTMLElement | null) => {
      refs.setFloating(node);
    },
    [blockOptionStore, refs],
  );

  return {
    isOpen,
    isMounted,
    blockId: blockOptionStore.blockId,
    reference: blockOptionStore.refs.reference,
    style: { ...floatingStyles, ...transitionStyles },
    setFloatingRef,
    open,
    close,
    duplicateBlock,
    copyBlockLink,
    deleteBlock,
  };
};
