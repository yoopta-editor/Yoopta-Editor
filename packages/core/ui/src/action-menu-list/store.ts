import { create } from 'zustand';
import { CSSProperties } from 'react';

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

export type ActionMenuListStore = {
  state: ActionMenuListState;
  searchText: string;
  selectedIndex: number;
  styles: CSSProperties;

  open: () => void;
  close: () => void;
  toggle: (state: ActionMenuListState) => void;
  setSearchText: (text: string) => void;
  setSelectedIndex: (index: number) => void;
  updateStyles: (styles: CSSProperties) => void;
  reset: () => void;
};

export const useActionMenuListStore = create<ActionMenuListStore>()((set) => ({
  state: 'closed',
  searchText: '',
  selectedIndex: 0,
  styles: INITIAL_STYLES,

  open() {
    set({ state: 'open' });
  },

  close() {
    set({ state: 'closed', searchText: '', selectedIndex: 0 });
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

  reset() {
    set({
      state: 'closed',
      searchText: '',
      selectedIndex: 0,
      styles: INITIAL_STYLES,
    });
  },
}));
