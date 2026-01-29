import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FloatingPortal,
  autoUpdate,
  flip,
  inline,
  offset,
  shift,
  useFloating,
  useTransitionStyles,
} from '@floating-ui/react';
import { useYooptaEditor } from '@yoopta/editor';

import { FloatingToolbarContext, useFloatingToolbarContext } from './context';
import { throttle } from '../utils/throttle';
import './floating-toolbar.css';

type FloatingToolbarApi = {
  isOpen: boolean;
};

type FloatingToolbarRootProps = {
  children: ReactNode | ((api: FloatingToolbarApi) => ReactNode);
  /** When true, selection tracking is paused (e.g., when a popover is open) */
  frozen?: boolean;
  className?: string;
};

const FloatingToolbarRoot = ({ children, frozen = false, className = '' }: FloatingToolbarRootProps) => {
  const editor = useYooptaEditor();
  const [isOpen, setIsOpen] = useState(false);

  // Local ref to track floating element for checking if active element is inside
  const floatingElRef = useRef<HTMLElement | null>(null);

  // Floating UI setup with autoUpdate for proper positioning
  const { refs, floatingStyles, context } = useFloating({
    placement: 'top-start',
    open: isOpen,
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 100,
  });

  console.log('FloatingToolbarRoot refs', refs);
  console.log('FloatingToolbarRoot open state', { isOpen, isMounted });

  // Combined styles
  const combinedStyles: CSSProperties = useMemo(
    () => ({ ...floatingStyles, ...transitionStyles }),
    [floatingStyles, transitionStyles],
  );

  // Keep setReference in a ref for stable callback
  const setReferenceFnRef = useRef(refs.setReference);
  setReferenceFnRef.current = refs.setReference;

  // Close toolbar
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Open toolbar
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Text selection change handler
  const selectionChange = useCallback(() => {
    if (frozen) return;

    // Check if active element is inside the toolbar
    const toolbarEl = floatingElRef.current;
    if (toolbarEl?.contains(document.activeElement)) {
      return;
    }

    const domSelection = window.getSelection();

    if (
      !domSelection ||
      domSelection?.isCollapsed ||
      domSelection?.anchorOffset === domSelection?.focusOffset
    ) {
      if (isOpen) {
        close();
      }
      return;
    }

    const domRange = domSelection.getRangeAt(0);
    const selectionRect = domRange.getBoundingClientRect();
    const text = domRange.toString().trim();

    const ancestor = domRange?.commonAncestorContainer;

    // Check if inside custom editor
    const isInsideCustomEditor = !!(ancestor as Element)?.closest?.('[data-custom-editor]');

    if (!editor.refElement?.contains(ancestor) || isInsideCustomEditor) {
      if (isOpen) {
        close();
      }
      return;
    }

    if (domRange && text.length > 0) {
      const reference = {
        getBoundingClientRect: () => selectionRect,
        getClientRects: () => domRange.getClientRects(),
      };

      setReferenceFnRef.current(reference);

      if (!isOpen) {
        open();
      }
    }
  }, [frozen, editor.refElement, close, open, isOpen]);

  // Block selection change handler
  const onBlockSelectionChange = useCallback(() => {
    if (
      !Array.isArray(editor.path.selected) ||
      editor.path.selected.length === 0 ||
      (editor.path.source !== 'mousemove' && editor.path.source !== 'keyboard')
    ) {
      if (isOpen) {
        close();
      }
      return;
    }

    const firstSelectedBlockPath = Math.min(...editor.path.selected);
    const lastSelectedBlockPath = Math.max(...editor.path.selected);

    let isBottomDirection = true;

    if (typeof editor.path.current === 'number') {
      isBottomDirection =
        Math.abs(editor.path.current - lastSelectedBlockPath) <=
        Math.abs(editor.path.current - firstSelectedBlockPath);
    }

    const selectedBlock = editor.getBlock({
      at: isBottomDirection ? lastSelectedBlockPath : firstSelectedBlockPath,
    });

    if (!selectedBlock) return;

    const blockEl = editor.refElement?.querySelector(`[data-yoopta-block-id="${selectedBlock.id}"]`);

    if (!blockEl) return;

    setReferenceFnRef.current(blockEl);

    if (!isOpen) {
      open();
    }
  }, [editor, close, open, isOpen]);

  // Throttled selection change
  const throttledSelectionChange = useMemo(
    () =>
      throttle(selectionChange, 200, {
        leading: true,
        trailing: true,
      }),
    [selectionChange],
  );

  // Selection tracking effect
  useEffect(() => {
    if (!Array.isArray(editor.path.selected) && !editor.path.selection) {
      if (isOpen) {
        close();
      }
      return;
    }

    if (Array.isArray(editor.path.selected) && !editor.path.selection) {
      onBlockSelectionChange();
      return;
    }

    window.document.addEventListener('selectionchange', throttledSelectionChange);
    return () => window.document.removeEventListener('selectionchange', throttledSelectionChange);
  }, [editor.path.selected, editor.path.selection, isOpen, throttledSelectionChange, close, onBlockSelectionChange]);

  // Ref callback that updates both local ref and floating ref
  const handleFloatingRef = useCallback(
    (node: HTMLElement | null) => {
      floatingElRef.current = node;
      refs.setFloating(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refs.setFloating, refs.setReference],
  );

  // Context value - use isMounted for visibility
  const contextValue = useMemo(
    () => ({
      isOpen: isMounted,
      floatingStyles: combinedStyles,
      setFloatingRef: handleFloatingRef,
    }),
    [isMounted, combinedStyles, handleFloatingRef],
  );

  // Render props or regular children
  const content = typeof children === 'function' ? children({ isOpen: isMounted }) : children;

  return (
    <FloatingToolbarContext.Provider value={contextValue}>
      <div className={className}>{content}</div>
    </FloatingToolbarContext.Provider>
  );
};

FloatingToolbarRoot.displayName = 'FloatingToolbar';

type FloatingToolbarContentProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const FloatingToolbarContent = ({ children, className = '', ...props }: FloatingToolbarContentProps) => {
  const editor = useYooptaEditor();
  const { isOpen, floatingStyles, setFloatingRef } = useFloatingToolbarContext();

  if (!isOpen) return null;

  return (
    <FloatingPortal root={editor.refElement} id={`yoopta-ui-floating-toolbar-portal-${editor.id}`}>
      <div
        ref={setFloatingRef}
        className={`yoopta-ui-floating-toolbar ${className}`}
        style={floatingStyles}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </FloatingPortal>
  );
};

FloatingToolbarContent.displayName = 'FloatingToolbar.Content';

type FloatingToolbarGroupProps = HTMLAttributes<HTMLDivElement>;

const FloatingToolbarGroup = forwardRef<HTMLDivElement, FloatingToolbarGroupProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`yoopta-ui-floating-toolbar-group ${className}`} {...props}>
      {children}
    </div>
  ),
);

FloatingToolbarGroup.displayName = 'FloatingToolbar.Group';

type FloatingToolbarSeparatorProps = HTMLAttributes<HTMLDivElement>;

const FloatingToolbarSeparator = forwardRef<HTMLDivElement, FloatingToolbarSeparatorProps>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`yoopta-ui-floating-toolbar-separator ${className}`} {...props} />
  ),
);

FloatingToolbarSeparator.displayName = 'FloatingToolbar.Separator';

type FloatingToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
} & HTMLAttributes<HTMLButtonElement>;

const FloatingToolbarButton = forwardRef<HTMLButtonElement, FloatingToolbarButtonProps>(
  ({ className = '', children, active, disabled, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      data-active={active}
      className={`yoopta-ui-floating-toolbar-button ${className}`}
      {...props}
    >
      {children}
    </button>
  ),
);

FloatingToolbarButton.displayName = 'FloatingToolbar.Button';

export const FloatingToolbar = Object.assign(FloatingToolbarRoot, {
  Root: FloatingToolbarRoot,
  Content: FloatingToolbarContent,
  Group: FloatingToolbarGroup,
  Separator: FloatingToolbarSeparator,
  Button: FloatingToolbarButton,
});

export type {
  FloatingToolbarRootProps,
  FloatingToolbarContentProps,
  FloatingToolbarGroupProps,
  FloatingToolbarSeparatorProps,
  FloatingToolbarButtonProps,
  FloatingToolbarApi,
};
