import { create } from 'zustand';
import { CSSProperties } from 'react';

const INITIAL_STYLES: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'hidden',
  zIndex: 99,
};

export type ToolbarState = 'open' | 'closed';

export type ToolbarStore = {
  state: ToolbarState;
  frozen: boolean; // Prevents toolbar from closing when interacting with nested modals
  styles: CSSProperties;
  reference: HTMLElement | null;
  floatingRef: HTMLElement | null;

  // Actions
  open: (reference?: HTMLElement | null) => void;
  close: () => void;
  toggle: (state: ToolbarState, reference?: HTMLElement | null) => void;
  setFrozen: (frozen: boolean) => void;
  updateStyles: (styles: CSSProperties) => void;
  reset: () => void;
  setFloatingRef: (floatingRef: HTMLElement | null) => void;
};

export const useToolbarStore = create<ToolbarStore>()((set) => ({
  // Initial state
  state: 'closed',
  frozen: false,
  styles: INITIAL_STYLES,
  reference: null,
  floatingRef: null,
  open(reference) {
    set({ state: 'open', reference: reference || null });
  },

  close() {
    set({ state: 'closed', frozen: false });
  },

  toggle(state, reference) {
    set({ state, reference: reference || null });
  },

  setFrozen(frozen) {
    set({ frozen });
  },

  updateStyles(styles) {
    set({ styles });
  },

  reset() {
    set({
      state: 'closed',
      frozen: false,
      styles: INITIAL_STYLES,
      reference: null,
      floatingRef: null,
    });
  },

  setFloatingRef(floatingRef: HTMLElement | null) {
    set({ floatingRef });
  },
}));
