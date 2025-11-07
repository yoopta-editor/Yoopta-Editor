import { create } from 'zustand';

export type FloatingBlockActionsStore = {
  id: string | null;
  state: 'hovering' | 'frozen' | 'closed';
  toggle: (actionState: 'hovering' | 'frozen' | 'closed', id?: string | null) => void;
};

export const useFloatingBlockActionsStore = create<FloatingBlockActionsStore>()((set) => ({
  id: null,
  state: 'closed',
  toggle(actionState, id) {
    set((state) => ({ ...state, state: actionState, id: id || null }));
  },
}));
