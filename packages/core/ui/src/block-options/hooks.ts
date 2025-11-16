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

/**
 * Lightweight hook for accessing only store actions
 * Use this when you only need to open/close the menu programmatically
 * without rendering the menu itself
 */
export const useBlockOptionsActions = () => {
  const editor = useYooptaEditor();
  const store = useBlockOptionsStore();

  const duplicateBlock = useCallback(
    (blockId: string) => {
      if (!blockId) {
        throw new Error('Block ID is required to duplicate block');
      }

      editor.duplicateBlock({ original: { blockId }, focus: true });
      store.close();
    },
    [editor, store],
  );

  const copyBlockLink = useCallback(
    (blockId: string) => {
      if (!blockId) {
        throw new Error('Block ID is required to copy block link');
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

      store.close();
    },
    [editor, store],
  );

  const deleteBlock = useCallback(
    (blockId: string | null) => {
      if (!blockId) {
        throw new Error('Block ID is required to delete block');
      }

      editor.deleteBlock({ blockId });
      editor.setPath({ current: null });

      store.close();
    },
    [editor, store],
  );

  return {
    open: store.open,
    close: store.close,
    state: store.state,
    blockId: store.blockId,
    reference: store.reference,
    duplicateBlock,
    copyBlockLink,
    deleteBlock,
  };
};

/**
 * Full hook with Floating UI, event listeners, and all logic
 * Use this only in the component that renders the BlockOptions
 */
export const useBlockOptions = () => {
  const editor = useYooptaEditor();
  const {
    state,
    blockId,
    reference: storeReference,
    open: storeOpen,
    close: storeClose,
    setReference,
  } = useBlockOptionsStore();

  const isOpen = state === 'open';

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

  // Sync store reference with Floating UI
  useEffect(() => {
    if (storeReference) {
      refs.setReference(storeReference);
    }
    if (isOpen) update();
  }, [refs, storeReference, isOpen, update]);

  const open = useCallback(
    ({ reference, blockId }: UseBlockOptionsOpenOptions) => {
      storeOpen({ reference, blockId });
    },
    [storeOpen],
  );

  const close = useCallback(() => {
    storeClose();
  }, [storeClose]);

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
    (blockId: string) => {
      if (!blockId) {
        throw new Error('Block ID is required to copy block link');
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
    [editor, close],
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

  const getRootProps = () => {
    return {
      ref: refs.setFloating,
      style: { ...floatingStyles, ...transitionStyles },
      onClick: (e: React.MouseEvent) => e.stopPropagation(),
      onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
    };
  };

  return {
    isOpen: isMounted,
    getRootProps,
    open,
    close,
    duplicateBlock,
    copyBlockLink,
    deleteBlock,
  };
};
