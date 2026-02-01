import { createContext, useContext } from 'react';

export type BlockOptionsContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: HTMLElement | null;
  setTriggerRef: (ref: HTMLElement | null) => void;
  contentId: string;
};

export const BlockOptionsContext = createContext<BlockOptionsContextValue | null>(null);

export const useBlockOptionsContext = () => {
  const context = useContext(BlockOptionsContext);
  if (!context) {
    throw new Error('BlockOptions components must be used within <BlockOptions>');
  }
  return context;
};
