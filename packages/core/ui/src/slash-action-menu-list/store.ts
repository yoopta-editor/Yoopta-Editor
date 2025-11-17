import { create } from 'zustand';
import { CSSProperties } from 'react';

const INITIAL_STYLES: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1000,
  opacity: 0,
  pointerEvents: 'none',
};

export type SlashActionMenuState = 'open' | 'closed';

export type SlashActionMenuStore = {
  state: SlashActionMenuState;
  searchText: string;
  selectedIndex: number;
  styles: CSSProperties;
  reference: HTMLElement | null;

  open: (reference?: HTMLElement | null) => void;
  close: () => void;
  setSearchText: (text: string) => void;
  setSelectedIndex: (index: number) => void;
  updateStyles: (styles: CSSProperties) => void;
  reset: () => void;
};

export const useSlashActionMenuStore = create<SlashActionMenuStore>()((set) => ({
  state: 'closed',
  searchText: '',
  selectedIndex: 0,
  styles: INITIAL_STYLES,
  reference: null,

  open(reference) {
    set((state) => ({
      state: 'open',
      reference: reference !== undefined ? reference : state.reference,
    }));
  },

  close() {
    set({
      state: 'closed',
      searchText: '',
      selectedIndex: 0,
    });
  },

  setSearchText(text) {
    set({ searchText: text });
  },

  setSelectedIndex(index) {
    set({ selectedIndex: index });
  },

  updateStyles(styles) {
    set((state) => ({
      styles: { ...state.styles, ...styles },
    }));
  },

  reset() {
    set({
      state: 'closed',
      searchText: '',
      selectedIndex: 0,
      styles: INITIAL_STYLES,
      reference: null,
    });
  },
}));
