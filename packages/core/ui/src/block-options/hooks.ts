import { useContext, useCallback, useEffect, CSSProperties } from 'react';
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
import { YooptaUIContext } from '../ui-context/yoopta-ui-context';

type UseBlockOptionsOpenOptions = {
  ref: HTMLElement;
  blockId?: string;
};

export const useBlockOptions = () => {
  const { uiRefs, uiState, setUIState, hoveredBlockId, onSetFrozenBlockId } =
    useContext(YooptaUIContext);
  const editor = useYooptaEditor();

  const { refs, floatingStyles, context, update } = useFloating({
    placement: 'right-start',
    open: uiState.blockOptions.isOpen,
    middleware: [inline(), offset(10), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    strategy: 'fixed',
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: {
      open: 150,
      close: 100,
    },
    initial: {
      opacity: 0,
      transform: 'scale(0.95)',
    },
  });

  useEffect(() => {
    if (uiState.blockOptions.isOpen && uiRefs.current.blockOptions.anchor) {
      refs.setReference(uiRefs.current.blockOptions.anchor);
    }
  }, [uiState.blockOptions.isOpen, uiRefs, refs]);

  const open = useCallback(
    ({ ref, blockId }: UseBlockOptionsOpenOptions) => {
      const targetBlockId = blockId || hoveredBlockId || editor.path.current?.toString() || null;
      uiRefs.current.blockOptions.anchor = ref;
      refs.setReference(ref);

      setUIState({
        blockOptions: {
          isOpen: true,
          blockId: targetBlockId,
        },
      });

      if (targetBlockId) {
        onSetFrozenBlockId(targetBlockId);
      }
    },
    [uiRefs, refs, setUIState, hoveredBlockId, editor.path.current, onSetFrozenBlockId],
  );

  const close = useCallback(() => {
    uiRefs.current.blockOptions.anchor = null;
    uiRefs.current.blockOptions.floating = null;

    setUIState({
      blockOptions: {
        isOpen: false,
        blockId: null,
      },
    });

    onSetFrozenBlockId(null);
  }, [uiRefs, setUIState, onSetFrozenBlockId]);

  const duplicateBlock = useCallback(() => {
    if (typeof editor.path.current !== 'number') {
      close();
      return;
    }

    editor.duplicateBlock({ original: { path: editor.path.current }, focus: true });
    close();
  }, [editor, close]);

  const copyBlockLink = useCallback(() => {
    const blockId = uiState.blockOptions.blockId || editor.path.current?.toString();
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
  }, [uiState.blockOptions.blockId, editor, close]);

  const deleteBlock = useCallback(() => {
    if (editor.path.current !== null) {
      editor.deleteBlock({ at: editor.path.current });
      editor.setPath({ current: null });
    }

    close();
  }, [editor, close]);

  const style: CSSProperties = {
    ...floatingStyles,
    ...transitionStyles,
  };

  const setFloatingRef = useCallback(
    (node: HTMLElement | null) => {
      uiRefs.current.blockOptions.floating = node;

      if (node) {
        refs.setFloating(node);
      }
    },
    [uiRefs, refs],
  );

  return {
    isOpen: uiState.blockOptions.isOpen,
    isMounted,
    style,
    setFloatingRef,
    open,
    close,
    duplicateBlock,
    copyBlockLink,
    deleteBlock,
  };
};
