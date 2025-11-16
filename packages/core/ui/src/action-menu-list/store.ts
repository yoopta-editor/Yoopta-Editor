import { create } from 'zustand';
import { Placement } from '@floating-ui/react';

export type ActionMenuListState = 'open' | 'closed';

export type ActionMenuListStore = {
  state: ActionMenuListState;
  view: 'small' | 'default';
  reference: HTMLElement | null;
  placement: Placement;
  blockId: string | null;

  open: (options?: {
    reference?: HTMLElement | null;
    placement?: Placement;
    blockId?: string;
    view?: 'small' | 'default';
  }) => void;
  close: () => void;
  toggle: (state: ActionMenuListState) => void;
  setView: (view: 'small' | 'default') => void;
  setReference: (reference: HTMLElement | null) => void;
  reset: () => void;
};

export const useActionMenuListStore = create<ActionMenuListStore>()((set) => ({
  state: 'closed',
  view: 'default',
  reference: null,
  placement: 'bottom-start',
  blockId: null,

  open(options = {}) {
    const { reference, view, placement, blockId } = options;
    set((state) => ({
      state: 'open',
      reference: reference !== undefined ? reference : state.reference,
      view: view !== undefined ? view : state.view,
      placement: placement !== undefined ? placement : state.placement,
      blockId: typeof blockId !== 'undefined' ? blockId : state.blockId,
    }));
  },

  close() {
    set({
      state: 'closed',
      view: 'default',
      placement: 'bottom-start',
      blockId: null,
    });
  },

  toggle(state) {
    set({ state });
  },

  setView(view) {
    set({ view });
  },

  setReference(reference) {
    set({ reference });
  },

  reset() {
    set({
      state: 'closed',
      view: 'default',
      reference: null,
      placement: 'bottom-start',
      blockId: null,
    });
  },
}));
