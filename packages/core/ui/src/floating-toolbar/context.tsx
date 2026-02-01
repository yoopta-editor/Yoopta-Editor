import { createContext, useContext } from 'react';
import type { CSSProperties } from 'react';

export type FloatingToolbarContextValue = {
  /** Whether toolbar is open/visible */
  isOpen: boolean;
  /** Floating UI styles for positioning */
  floatingStyles: CSSProperties;
  /** Ref setter for the floating element */
  setFloatingRef: (node: HTMLElement | null) => void;
};

export const FloatingToolbarContext = createContext<FloatingToolbarContextValue | null>(null);

export const useFloatingToolbarContext = () => {
  const context = useContext(FloatingToolbarContext);

  if (!context) {
    throw new Error('FloatingToolbar components must be used within <FloatingToolbar>');
  }

  return context;
};
