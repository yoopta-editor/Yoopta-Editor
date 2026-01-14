import { useEffect, useLayoutEffect } from 'react';
import type { VirtualElement } from '@floating-ui/react';
import { autoUpdate, flip, inline, offset, shift, size, useFloating } from '@floating-ui/react';

import { MENU_OFFSET } from '../constants';

type UsePositioningOptions = {
  isOpen: boolean;
  virtualElement: VirtualElement | null;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function usePositioning({ isOpen, virtualElement }: UsePositioningOptions) {
  const { refs, floatingStyles, context, update } = useFloating({
    open: isOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      inline(),
      offset(MENU_OFFSET),
      flip({
        fallbackPlacements: ['top-start', 'top', 'bottom'],
        padding: 10,
        crossAxis: false,
        fallbackStrategy: 'bestFit',
      }),
      shift({ padding: 10 }),
      size({
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(200, availableHeight - 20)}px`,
          });
        },
        padding: 10,
      }),
    ],
    strategy: 'fixed',
  });

  useIsomorphicLayoutEffect(() => {
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

  const rect = domRange.getBoundingClientRect();
  const rects = domRange.getClientRects();

  return {
    getBoundingClientRect: () => rect,
    getClientRects: () => rects,
  };
}
