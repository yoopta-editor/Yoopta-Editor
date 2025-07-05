import React, { createContext, CSSProperties, useContext, useState } from 'react';
import { useToolbar } from './useToolbar';

type ToolbarOpenProps = {
  element: HTMLElement;
};

interface ToolbarContextValue {
  open: (props: ToolbarOpenProps) => void;
  close: () => void;
  isOpen: boolean;
  style: CSSProperties;
  setFloatingRef: (node: HTMLDivElement | null) => void;
}

const ToolbarContext = createContext<ToolbarContextValue | null>(null);

export const useToolbarContext = () => {
  const context = useContext(ToolbarContext);
  if (!context) {
    throw new Error('Toolbar components must be used within ToolbarProvider');
  }
  return context;
};

interface ToolbarProviderProps {
  children: React.ReactNode;
}

export const ToolbarProvider = ({ children }: ToolbarProviderProps) => {
  const { setFloatingRef, setRef, isOpen, setIsOpen, style } = useToolbar();

  const open = ({ element }: ToolbarOpenProps) => {
    setRef(element);
    setIsOpen(true);
  };

  const close = () => {
    setRef(null);
    setIsOpen(false);
  };

  const contextValue: ToolbarContextValue = {
    open,
    close,
    isOpen,
    setFloatingRef,
    style,
  };

  return <ToolbarContext.Provider value={contextValue}>{children}</ToolbarContext.Provider>;
};
