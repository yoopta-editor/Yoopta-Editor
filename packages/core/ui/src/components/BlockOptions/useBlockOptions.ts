import { useFloating, offset, flip, inline, shift, useTransitionStyles, autoUpdate } from '@floating-ui/react';
import { CSSProperties, useState } from 'react';

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
    middleware: [inline(), flip(), shift(), offset()],
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
