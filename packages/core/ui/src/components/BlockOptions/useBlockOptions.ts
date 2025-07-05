import { useFloating, offset, flip, inline, shift, useTransitionStyles, autoUpdate } from '@floating-ui/react';
import { useYooptaEditor } from '@yoopta/editor';
import { CSSProperties, useState } from 'react';
import { useBlockOptionsContext } from './BlockOptionsContext';

export type BlockOptionsRefs = {
  setRef: (node: HTMLElement | null) => void;
  setFloatingRef: (node: HTMLElement | null) => void;
};

export type BlockOptionsReturn = BlockOptionsRefs & {
  style: CSSProperties;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useBlockOptions = (): BlockOptionsReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    refs: blockOptionsRefs,
    floatingStyles: blockOptionsStyles,
    context: blockOptionsContext,
  } = useFloating({
    placement: 'right-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [inline(), flip(), shift(), offset(5)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted: isBlockOptionsMounted, styles: blockOptionsTransitionStyles } = useTransitionStyles(
    blockOptionsContext,
    { duration: 100 },
  );

  const blockOptionsFloatingStyle = { ...blockOptionsStyles, ...blockOptionsTransitionStyles };

  return {
    setRef: blockOptionsRefs.setReference,
    setFloatingRef: blockOptionsRefs.setFloating,
    style: blockOptionsFloatingStyle,
    isOpen: isOpen && isBlockOptionsMounted,
    setIsOpen,
  };
};

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
