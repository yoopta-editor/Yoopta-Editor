import { create } from 'zustand';

export type BlockOptionsStore = {
  state: 'open' | 'closed';
  refs: {
    floating: HTMLElement | null;
    reference: HTMLElement | null;
  };
  setReference: (node: HTMLElement | null) => void;
  toggle: (actionState: 'open' | 'closed', reference?: HTMLElement | null) => void;
};

export const useBlockOptionsStore = create<BlockOptionsStore>()((set) => ({
  state: 'closed',
  refs: {
    floating: null,
    reference: null,
  },
  setReference(node) {
    set((state) => ({ ...state, refs: { ...state.refs, reference: node } }));
  },
  toggle(actionState, reference) {
    set((state) => ({
      ...state,
      state: actionState,
      refs: { ...state.refs, reference: reference || null },
    }));
  },
}));
