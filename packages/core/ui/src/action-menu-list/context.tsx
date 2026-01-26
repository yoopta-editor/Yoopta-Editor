import { createContext, useContext } from 'react';
import type { CSSProperties } from 'react';
import type { ActionMenuItem } from './types';

export type ActionMenuListContextValue = {
  /** Whether menu is open */
  isOpen: boolean;
  /** Current view mode */
  view: 'small' | 'default';
  /** Available actions from editor plugins */
  actions: ActionMenuItem[];
  /** Currently selected/hovered action */
  selectedAction: ActionMenuItem | null;
  /** Select an action (hover) */
  setSelectedAction: (action: ActionMenuItem) => void;
  /** Execute action (toggle block) */
  onSelect: (type: string) => void;
  /** Close the menu */
  close: () => void;
  /** Floating styles for positioning */
  floatingStyles: CSSProperties;
  /** Ref setter for floating element */
  setFloatingRef: (node: HTMLElement | null) => void;
};

export const ActionMenuListContext = createContext<ActionMenuListContextValue | null>(null);

export const useActionMenuListContext = () => {
  const context = useContext(ActionMenuListContext);

  if (!context) {
    throw new Error('ActionMenuList components must be used within <ActionMenuList>');
  }

  return context;
};
