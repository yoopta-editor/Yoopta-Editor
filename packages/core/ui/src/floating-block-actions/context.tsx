import { createContext, useContext } from 'react';
import type { YooptaBlockData } from '@yoopta/editor';

export type FloatingBlockActionsContextValue = {
  /** Currently hovered block ID */
  blockId: string | null;
  /** Block data for the hovered block */
  blockData: YooptaBlockData | null;
  /** Whether actions are visible */
  isVisible: boolean;
  /** Hide the floating actions manually */
  hide: () => void;
};

export const FloatingBlockActionsContext = createContext<FloatingBlockActionsContextValue | null>(null);

export const useFloatingBlockActionsContext = () => {
  const context = useContext(FloatingBlockActionsContext);

  if (!context) {
    throw new Error('FloatingBlockActions components must be used within <FloatingBlockActions>');
  }

  return context;
};
