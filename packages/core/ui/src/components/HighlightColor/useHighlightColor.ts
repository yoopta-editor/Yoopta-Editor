import { useState, useCallback } from 'react';
import { useFloating, useInteractions, useClick, useDismiss, useRole, useId } from '@floating-ui/react';

export interface UseHighlightColorOptions {
  editor?: any; // YooEditor type
  highlightColors?: React.CSSProperties;
  onClose?: () => void;
}

export interface UseHighlightColorReturn {
  isOpen: boolean;
  open: (options?: { element?: HTMLElement }) => void;
  close: () => void;
  toggle: () => void;
  refs: {
    setFloating: (node: HTMLElement | null) => void;
    setReference: (node: HTMLElement | null) => void;
  };
  floatingStyles: React.CSSProperties;
  getReferenceProps: (userProps?: React.HTMLProps<HTMLElement>) => any;
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => any;
  context: any;
}

export const useHighlightColor = ({
  editor,
  highlightColors = {},
  onClose,
}: UseHighlightColorOptions = {}): UseHighlightColorReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    middleware: [],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const id = useId();

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const open = useCallback(
    (options?: { element?: HTMLElement }) => {
      if (options?.element) {
        refs.setReference(options.element);
      }
      setIsOpen(true);
    },
    [refs],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    refs: {
      setFloating: refs.setFloating,
      setReference: refs.setReference,
    },
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    context,
  };
};
