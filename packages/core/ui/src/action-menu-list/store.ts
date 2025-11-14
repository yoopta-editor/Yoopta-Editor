import { create } from 'zustand';
import { CSSProperties } from 'react';
import { Placement } from '@floating-ui/react';

const INITIAL_STYLES: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: 0,
  pointerEvents: 'none',
  transition: 'opacity 100ms ease-out, transform 100ms ease-out',
  transform: 'translateY(-4px)',
  zIndex: 9999,
};

export type ActionMenuListState = 'open' | 'closed';
export type ActionMenuListMode = 'slash' | 'button';

export type ActionMenuListStore = {
  state: ActionMenuListState;
  searchText: string;
  selectedIndex: number;
  styles: CSSProperties;
  view: 'small' | 'default';
  reference: HTMLElement | null;
  mode: ActionMenuListMode;
  placement: Placement;

  open: (options?: {
    reference?: HTMLElement | null;
    view?: 'small' | 'default';
    mode?: ActionMenuListMode;
    placement?: Placement;
  }) => void;
  close: () => void;
  toggle: (state: ActionMenuListState) => void;
  setSearchText: (text: string) => void;
  setSelectedIndex: (index: number) => void;
  updateStyles: (styles: CSSProperties) => void;
  setView: (view: 'small' | 'default') => void;
  setReference: (reference: HTMLElement | null) => void;
  reset: () => void;
};

export const useActionMenuListStore = create<ActionMenuListStore>()((set) => ({
  state: 'closed',
  searchText: '',
  selectedIndex: 0,
  styles: INITIAL_STYLES,
  view: 'default',
  reference: null,
  mode: 'slash',
  placement: 'bottom-start',

  open(options = {}) {
    const { reference, view, mode, placement } = options;
    set((state) => ({
      state: 'open',
      reference: reference !== undefined ? reference : state.reference,
      view: view !== undefined ? view : state.view,
      mode: mode !== undefined ? mode : state.mode,
      placement: placement !== undefined ? placement : state.placement,
    }));
  },

  close() {
    set({
      state: 'closed',
      searchText: '',
      selectedIndex: 0,
      view: 'default',
      mode: 'slash',
      placement: 'bottom-start',
    });
  },

  toggle(state) {
    set({ state });
  },

  setSearchText(text) {
    set({ searchText: text, selectedIndex: 0 });
  },

  setSelectedIndex(index) {
    set({ selectedIndex: index });
  },

  updateStyles(styles) {
    set({ styles });
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
      searchText: '',
      selectedIndex: 0,
      styles: INITIAL_STYLES,
      view: 'default',
      reference: null,
      mode: 'slash',
      placement: 'bottom-start',
    });
  },
}));
