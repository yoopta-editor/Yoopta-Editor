import { useLayoutEffect } from 'react';
import type { VirtualElement } from '@floating-ui/react';
import { flip, offset, shift, useFloating } from '@floating-ui/react';

import { MENU_OFFSET } from '../constants';

type UsePositioningOptions = {
  isOpen: boolean;
  virtualElement: VirtualElement | null;
};

export function usePositioning({ isOpen, virtualElement }: UsePositioningOptions) {
  const { refs, floatingStyles, context, update } = useFloating({
    open: isOpen,
    placement: 'bottom-start',
    middleware: [offset(MENU_OFFSET), flip(), shift()],
    strategy: 'fixed',
  });

  useLayoutEffect(() => {
    if (virtualElement) {
      refs.setReference(virtualElement);
      update();
    }
  }, [refs, isOpen, virtualElement, update]);

  return {
    refs,
    floatingStyles,
    floatingContext: context,
  };
}

export function getVirtualElementRects(): VirtualElement | null {
  const domSelection = window.getSelection();
  if (!domSelection || domSelection.rangeCount === 0) return null;

  const domRange = domSelection.getRangeAt(0);

  return {
    getBoundingClientRect: () => domRange.getBoundingClientRect(),
    getClientRects: () => domRange.getClientRects(),
  };
}
