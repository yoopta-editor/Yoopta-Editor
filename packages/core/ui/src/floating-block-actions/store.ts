import { create } from 'zustand';
import { CSSProperties } from 'react';

const INITIAL_STYLES: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  opacity: 0,
  pointerEvents: 'none',
  transform: 'scale(0.95) translateX(-46px)',
  transition: 'opacity 150ms ease-out, transform 150ms ease-out',
};

export type FloatingBlockActionsState = 'hovering' | 'frozen' | 'closed';

export type FloatingBlockActionsStore = {
  blockId: string | null;
  state: FloatingBlockActionsState;
  position: { top: number; left: number };
  styles: CSSProperties;
  reference: HTMLElement | null;

  setReference: (reference: HTMLElement | null) => void;
  toggle: (actionState: FloatingBlockActionsState, blockId?: string | null) => void;
  updatePosition: (top: number, left: number, blockActionsWidth?: number) => void;
  hide: () => void;
  reset: () => void;
};

export const useFloatingBlockActionsStore = create<FloatingBlockActionsStore>()((set, get) => ({
  blockId: null,
  state: 'closed',
  position: { top: 0, left: 0 },
  styles: INITIAL_STYLES,
  reference: null,

  setReference(reference) {
    set({ reference });
  },
  toggle(actionState, blockId) {
    set({ state: actionState, blockId: blockId || null });
  },

  updatePosition(top, left, blockActionsWidth = 46) {
    set({
      position: { top, left },
      styles: {
        ...get().styles,
        top,
        left,
        opacity: 1,
        transform: `scale(1) translateX(-${blockActionsWidth + 2}px)`,
        pointerEvents: 'auto',
      },
    });
  },

  hide() {
    set({
      state: 'closed',
      blockId: null,
      styles: {
        ...get().styles,
        opacity: 0,
        transform: INITIAL_STYLES.transform,
        pointerEvents: 'none',
      },
    });
  },

  reset() {
    set({
      blockId: null,
      state: 'closed',
      position: { top: 0, left: 0 },
      styles: INITIAL_STYLES,
    });
  },
}));
