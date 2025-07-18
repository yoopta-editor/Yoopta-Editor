import React, { createContext, useContext, useCallback, useMemo, useRef, useState } from 'react';
import { useFloating, offset, flip, shift, autoUpdate, useTransitionStyles } from '@floating-ui/react';

type ActionMenuOpenReferenceOptions = {
  getBoundingClientRect: () => DOMRect;
  getClientRects: () => DOMRectList;
};

interface ActionMenuContextValue {
  isOpen: boolean;
  style: React.CSSProperties;
  setFloatingRef: (node: HTMLDivElement | null) => void;
  open: (element: HTMLElement | ActionMenuOpenReferenceOptions) => void;
  close: () => void;
}

const ActionMenuContext = createContext<ActionMenuContextValue | null>(null);

export const useActionMenuContext = () => {
  const context = useContext(ActionMenuContext);
  if (!context) {
    throw new Error('ActionMenu components must be used within ActionMenuProvider');
  }
  return context;
};

interface ActionMenuProviderProps {
  children: React.ReactNode;
}

export const ActionMenuProvider = ({ children }: ActionMenuProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    refs,
    floatingStyles,
    update: updatePosition,
    context,
  } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { styles: transitionStyles, isMounted } = useTransitionStyles(context, {
    duration: 100,
  });

  const open = useCallback(
    (element: HTMLElement | ActionMenuOpenReferenceOptions) => {
      console.log('open element:', element);
      if (element instanceof HTMLElement) {
        refs.setReference({
          getBoundingClientRect: () => element.getBoundingClientRect(),
          getClientRects: () => element.getClientRects(),
        });
      } else {
        const { getBoundingClientRect, getClientRects } = element;
        refs.setReference({
          getBoundingClientRect,
          getClientRects,
        });
      }

      setIsOpen(true);
    },
    [refs],
  );

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      console.log('setFloatingRef node:', node);
      refs.setFloating(node);
    },
    [refs],
  );

  const style = useMemo(
    () => ({
      ...floatingStyles,
      ...transitionStyles,
    }),
    [floatingStyles, transitionStyles],
  );

  const contextValue: ActionMenuContextValue = useMemo(
    () => ({
      isOpen: isMounted,
      style,
      setFloatingRef,
      open,
      close,
    }),
    [isMounted, style, setFloatingRef, open, close],
  );

  return <ActionMenuContext.Provider value={contextValue}>{children}</ActionMenuContext.Provider>;
};
