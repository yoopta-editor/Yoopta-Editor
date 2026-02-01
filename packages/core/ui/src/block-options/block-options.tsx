import { cloneElement, forwardRef, isValidElement, useCallback, useMemo, useState } from 'react';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useMergeRefs,
  useTransitionStyles,
} from '@floating-ui/react';
import { useYooptaEditor } from '@yoopta/editor';

import { Overlay } from '../overlay';
import { BlockOptionsContext, useBlockOptionsContext } from './context';
import './block-options.css';

type Placement = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

type BlockOptionsRootProps = {
  children: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** External anchor element for positioning (use when no Trigger is present) */
  anchor?: HTMLElement | null;
};

const BlockOptionsRoot = ({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  anchor = null,
}: BlockOptionsRootProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [internalTriggerRef, setInternalTriggerRef] = useState<HTMLElement | null>(null);
  const contentId = useId();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  // Use external anchor if provided, otherwise use internal trigger ref
  const triggerRef = anchor ?? internalTriggerRef;

  const onOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      controlledOnOpenChange?.(newOpen);
    },
    [isControlled, controlledOnOpenChange],
  );

  const contextValue = useMemo(
    () => ({
      open,
      onOpenChange,
      triggerRef,
      setTriggerRef: setInternalTriggerRef,
      contentId,
    }),
    [open, onOpenChange, triggerRef, contentId],
  );

  return <BlockOptionsContext.Provider value={contextValue}>{children}</BlockOptionsContext.Provider>;
};

BlockOptionsRoot.displayName = 'BlockOptions';

type BlockOptionsTriggerProps = {
  children: ReactNode;
  /** Merge props onto child element instead of wrapping */
  asChild?: boolean;
  className?: string;
};

const BlockOptionsTrigger = forwardRef<HTMLButtonElement, BlockOptionsTriggerProps>(
  ({ children, asChild = false, className = '' }, forwardedRef) => {
    const { open, onOpenChange, setTriggerRef, contentId } = useBlockOptionsContext();

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onOpenChange(!open);
      },
      [open, onOpenChange],
    );

    const mergedRef = useMergeRefs([forwardedRef, setTriggerRef]);

    const triggerProps = {
      ref: mergedRef,
      onClick: handleClick,
      'aria-expanded': open,
      'aria-haspopup': 'menu' as const,
      'aria-controls': open ? contentId : undefined,
    };

    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement<Record<string, unknown>>, triggerProps);
    }

    return (
      <button type="button" className={`yoopta-ui-block-options-trigger ${className}`} {...triggerProps}>
        {children}
      </button>
    );
  },
);

BlockOptionsTrigger.displayName = 'BlockOptions.Trigger';

type BlockOptionsContentProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Placement relative to trigger */
  side?: Placement;
  /** Alignment relative to trigger */
  align?: Align;
  /** Offset from trigger in pixels */
  sideOffset?: number;
};

const BlockOptionsContent = forwardRef<HTMLDivElement, BlockOptionsContentProps>(
  ({ children, className = '', style, side = 'right', align = 'start', sideOffset = 5 }, forwardedRef) => {
    const { open, onOpenChange, triggerRef, contentId } = useBlockOptionsContext();
    const editor = useYooptaEditor();

    const placement = align === 'center' ? side : (`${side}-${align}` as const);

    const { refs, floatingStyles, context } = useFloating({
      elements: {
        reference: triggerRef,
      },
      placement,
      open,
      onOpenChange,
      middleware: [offset(sideOffset), flip(), shift({ padding: 8 })],
      whileElementsMounted: autoUpdate,
      strategy: 'fixed',
    });

    const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
      duration: 150,
      initial: { opacity: 0 },
      open: { opacity: 1 },
      close: { opacity: 0 },
    });

    // Handle dismiss (outside click, escape key)
    const dismiss = useDismiss(context, {
      outsidePress: true,
      escapeKey: true,
    });

    const { getFloatingProps } = useInteractions([dismiss]);

    const contentRef = useMergeRefs([refs.setFloating, forwardedRef]);

    if (!isMounted) return null;

    return (
      <FloatingPortal root={editor.refElement} id={`yoopta-ui-block-options-portal-${editor.id}`}>
        <Overlay lockScroll={false} onClick={() => onOpenChange(false)}>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={contentRef}
              id={contentId}
              role="menu"
              aria-orientation="vertical"
              className={`yoopta-ui-block-options ${className}`}
              style={{ ...floatingStyles, ...transitionStyles, ...style }}
              contentEditable={false}
              {...getFloatingProps({
                onClick: (e) => e.stopPropagation(),
                onMouseDown: (e) => e.stopPropagation(),
              })}
            >
              {children}
            </div>
          </FloatingFocusManager>
        </Overlay>
      </FloatingPortal>
    );
  },
);

BlockOptionsContent.displayName = 'BlockOptions.Content';

type BlockOptionsGroupProps = {
  children: ReactNode;
  className?: string;
};

const BlockOptionsGroup = forwardRef<HTMLDivElement, BlockOptionsGroupProps>(
  ({ children, className = '' }, ref) => (
    <div ref={ref} role="group" className={`yoopta-ui-block-options-group ${className}`}>
      {children}
    </div>
  ),
);

BlockOptionsGroup.displayName = 'BlockOptions.Group';

type BlockOptionsItemProps = {
  children: ReactNode;
  /** Called when item is selected */
  onSelect?: (event: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  /** Visual variant */
  variant?: 'default' | 'destructive';
  /** Keep menu open after selection */
  keepOpen?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'>;

const BlockOptionsItem = forwardRef<HTMLButtonElement, BlockOptionsItemProps>(
  (
    { children, onSelect, className = '', disabled, icon, variant = 'default', keepOpen = false, ...props },
    ref,
  ) => {
    const { onOpenChange } = useBlockOptionsContext();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;

        onSelect?.(e);

        // Auto-close menu after selection (Radix behavior) unless keepOpen is true
        if (!keepOpen) {
          onOpenChange(false);
        }
      },
      [disabled, onSelect, onOpenChange, keepOpen],
    );

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        disabled={disabled}
        className={`yoopta-ui-block-options-button yoopta-ui-block-options-button-${variant} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {icon && <span className="yoopta-ui-block-options-button-icon">{icon}</span>}
        <span className="yoopta-ui-block-options-button-text">{children}</span>
      </button>
    );
  },
);

BlockOptionsItem.displayName = 'BlockOptions.Item';

type BlockOptionsSeparatorProps = {
  className?: string;
};

const BlockOptionsSeparator = forwardRef<HTMLDivElement, BlockOptionsSeparatorProps>(
  ({ className = '' }, ref) => (
    <div ref={ref} role="separator" className={`yoopta-ui-block-options-separator ${className}`} />
  ),
);

BlockOptionsSeparator.displayName = 'BlockOptions.Separator';

type BlockOptionsLabelProps = {
  children: ReactNode;
  className?: string;
};

const BlockOptionsLabel = forwardRef<HTMLDivElement, BlockOptionsLabelProps>(
  ({ children, className = '' }, ref) => (
    <div ref={ref} className={`yoopta-ui-block-options-label ${className}`}>
      {children}
    </div>
  ),
);

BlockOptionsLabel.displayName = 'BlockOptions.Label';

export const BlockOptions = Object.assign(BlockOptionsRoot, {
  Root: BlockOptionsRoot,
  Trigger: BlockOptionsTrigger,
  Content: BlockOptionsContent,
  Group: BlockOptionsGroup,
  Item: BlockOptionsItem,
  Separator: BlockOptionsSeparator,
  Label: BlockOptionsLabel,
});

export type {
  BlockOptionsRootProps,
  BlockOptionsTriggerProps,
  BlockOptionsContentProps,
  BlockOptionsGroupProps,
  BlockOptionsItemProps,
  BlockOptionsSeparatorProps,
  BlockOptionsLabelProps,
};
