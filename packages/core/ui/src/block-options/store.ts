import { create } from 'zustand';

export type BlockOptionsStore = {
  blockId: string | null;
  state: 'open' | 'closed';
  refs: {
    floating: HTMLElement | null;
    reference: HTMLElement | null;
  };
  setReference: (node: HTMLElement | null) => void;
  toggle: (
    actionState: 'open' | 'closed',
    reference?: HTMLElement | null,
    blockId?: string | null,
  ) => void;
};

export const useBlockOptionsStore = create<BlockOptionsStore>()((set) => ({
  blockId: null,
  state: 'closed',
  refs: {
    floating: null,
    reference: null,
  },
  setReference(node) {
    set((state) => ({ ...state, refs: { ...state.refs, reference: node } }));
  },
  toggle(actionState, reference, blockId) {
    set((state) => ({
      ...state,
      state: actionState,
      refs: { ...state.refs, reference: reference || null },
      blockId: blockId || null,
    }));
  },
}));
