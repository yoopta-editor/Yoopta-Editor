import React, { createContext, CSSProperties, useContext, useState } from 'react';
import { BlockOptionsRefs, useBlockOptions } from './useBlockOptions';

type BlockOptionsOpenProps = {
  element: HTMLElement;
};

interface BlockOptionsContextValue extends BlockOptionsRefs {
  open: (props: BlockOptionsOpenProps) => void;
  close: () => void;
  isOpen: boolean;
  style: CSSProperties;
}

const BlockOptionsContext = createContext<BlockOptionsContextValue | null>(null);

export const useBlockOptionsContext = () => {
  const context = useContext(BlockOptionsContext);
  if (!context) {
    throw new Error('BlockOptions components must be used within BlockOptionsProvider');
  }
  return context;
};

interface BlockOptionsProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const BlockOptionsProvider = ({ children }: BlockOptionsProviderProps) => {
  const { setFloatingRef, setRef, isOpen, setIsOpen, style } = useBlockOptions();

  const open = ({ element }: BlockOptionsOpenProps) => {
    setRef(element);
    setIsOpen(true);
  };

  const close = () => {
    setRef(null);
    setIsOpen(false);
  };

  const contextValue: BlockOptionsContextValue = {
    open,
    close,
    isOpen,
    setRef,
    setFloatingRef,
    style,
  };

  return <BlockOptionsContext.Provider value={contextValue}>{children}</BlockOptionsContext.Provider>;
};
