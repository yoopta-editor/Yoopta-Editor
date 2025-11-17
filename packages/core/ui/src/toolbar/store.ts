import { create } from 'zustand';

export type ToolbarState = 'open' | 'closed';

export type ToolbarStore = {
  state: ToolbarState;
  frozen: boolean; // Prevents toolbar from closing when interacting with nested modals

  // Actions
  open: () => void;
  close: () => void;
  toggle: (state: ToolbarState) => void;
  setFrozen: (frozen: boolean) => void;
  reset: () => void;
};

export const useToolbarStore = create<ToolbarStore>()((set) => ({
  state: 'closed',
  frozen: false,

  open() {
    set({ state: 'open' });
  },

  close() {
    set({ state: 'closed', frozen: false });
  },

  toggle(state) {
    set({ state });
  },

  setFrozen(frozen) {
    set({ frozen });
  },

  reset() {
    set({
      state: 'closed',
      frozen: false,
    });
  },
}));
