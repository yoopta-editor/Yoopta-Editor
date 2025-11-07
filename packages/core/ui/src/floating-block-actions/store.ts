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
  // State
  id: string | null;
  state: FloatingBlockActionsState;
  position: { top: number; left: number };
  styles: CSSProperties;
  reference: HTMLElement | null;

  // Actions
  setReference: (reference: HTMLElement | null) => void;
  toggle: (actionState: FloatingBlockActionsState, id?: string | null) => void;
  updatePosition: (top: number, left: number, blockActionsWidth?: number) => void;
  hide: () => void;
  reset: () => void;
};

export const useFloatingBlockActionsStore = create<FloatingBlockActionsStore>()((set, get) => ({
  // Initial state
  id: null,
  state: 'closed',
  position: { top: 0, left: 0 },
  styles: INITIAL_STYLES,
  reference: null,

  setReference(reference) {
    set({ reference });
  },
  // Toggle state
  toggle(actionState, id) {
    set({ state: actionState, id: id || null });
  },

  // Update position and styles
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

  // Hide actions
  hide() {
    set({
      state: 'closed',
      id: null,
      styles: {
        ...get().styles,
        opacity: 0,
        transform: INITIAL_STYLES.transform,
        pointerEvents: 'none',
      },
    });
  },

  // Reset to initial state
  reset() {
    set({
      id: null,
      state: 'closed',
      position: { top: 0, left: 0 },
      styles: INITIAL_STYLES,
    });
  },
}));
