import { create } from 'zustand';

export type BlockOptionsStore = {
  blockId: string | null;
  state: 'open' | 'closed';
  reference: HTMLElement | null;

  open: (options: { reference: HTMLElement; blockId?: string }) => void;
  close: () => void;
  toggle: (
    actionState: 'open' | 'closed',
    reference?: HTMLElement | null,
    blockId?: string | null,
  ) => void;
  setReference: (node: HTMLElement | null) => void;
  reset: () => void;
};

export const useBlockOptionsStore = create<BlockOptionsStore>()((set) => ({
  blockId: null,
  state: 'closed',
  reference: null,

  open(options) {
    const { reference, blockId } = options;
    set({
      state: 'open',
      reference,
      blockId: blockId || null,
    });
  },

  close() {
    set({
      state: 'closed',
      reference: null,
      blockId: null,
    });
  },

  toggle(actionState, reference, blockId) {
    if (actionState === 'closed') {
      set({
        state: 'closed',
        reference: null,
        blockId: null,
      });
    } else {
      set((state) => ({
        ...state,
        state: actionState,
        reference: reference !== undefined ? reference : state.reference,
        blockId: blockId !== undefined ? blockId : state.blockId,
      }));
    }
  },

  setReference(node) {
    set({ reference: node });
  },

  reset() {
    set({
      blockId: null,
      state: 'closed',
      reference: null,
    });
  },
}));
