import React, { CSSProperties, useCallback, createContext, useContext, MouseEvent } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFloatingBlockActions } from './useFloatingBlockActions';
import './floating-block-actions.css';

export interface FloatingBlockActionsProps {
  readOnly?: boolean;
  hideDelay?: number;
  throttleDelay?: number;
  className?: string;
  style?: React.CSSProperties;
  onBlockHover?: (blockId: string | null) => void;
  onPlusClick?: (blockId: string) => void;
  onDragClick?: (blockId: string) => void;
  icons?: {
    plus?: React.ReactNode;
    drag?: React.ReactNode;
  };
  actions?: Array<'plus' | 'drag' | React.ReactNode> | null;
  animate?: boolean;
  portalId?: string;
  children?: React.ReactNode;
}

interface FloatingBlockActionsContextValue {
  hoveredBlockId: string | null;
  position: { top: number; left: number };
  visible: boolean;
  actionsRef: React.MutableRefObject<HTMLDivElement | null>;
  icons?: {
    plus?: React.ReactNode;
    drag?: React.ReactNode;
  };
  animate?: boolean;
  portalId?: string;
}

const FloatingBlockActionsContext = createContext<FloatingBlockActionsContextValue | null>(null);

export const useFloatingBlockActionsContext = () => {
  const context = useContext(FloatingBlockActionsContext);
  if (!context) {
    throw new Error('FloatingBlockActions components must be used within FloatingBlockActions.Root');
  }
  return context;
};

// Root component
const Root = React.forwardRef<HTMLDivElement, FloatingBlockActionsProps>(
  (
    {
      readOnly = false,
      hideDelay = 150,
      throttleDelay = 100,
      className,
      style,
      onBlockHover,
      icons,
      animate = true,
      portalId = 'floating-block-actions',
      children,
    },
    ref,
  ) => {
    const { hoveredBlockId, position, visible, actionsRef } = useFloatingBlockActions({
      readOnly,
      hideDelay,
      throttleDelay,
      onBlockHover,
    });

    const containerStyles: React.CSSProperties = {
      position: 'fixed',
      top: position.top,
      left: position.left,
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1) translateX(-100%)' : 'scale(0.95) translateX(-100%)',
      transition: animate ? 'opacity 150ms ease-out, transform 150ms ease-out' : 'none',
      zIndex: 1000,
      pointerEvents: visible ? 'auto' : 'none',
      ...style,
    };

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        actionsRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        }
      },
      [ref, actionsRef],
    );

    const contextValue: FloatingBlockActionsContextValue = {
      hoveredBlockId,
      position,
      visible,
      actionsRef,
      icons,
      animate,
      portalId,
    };

    // If children are provided, use compositional API
    if (!visible && !hoveredBlockId) {
      return null;
    }

    return (
      <FloatingBlockActionsContext.Provider value={contextValue}>
        <div
          ref={setRefs}
          className={cn('yoo-floating-block-actions', className)}
          style={containerStyles}
          contentEditable={false}
          data-portal-id={portalId}
        >
          {children}
        </div>
      </FloatingBlockActionsContext.Provider>
    );
  },
);

Root.displayName = 'FloatingBlockActions.Root';

export type PlusActionProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

// PlusAction component
const PlusAction = React.forwardRef<HTMLButtonElement, PlusActionProps>(({ className, style, ...props }, ref) => {
  const { icons } = useFloatingBlockActionsContext();

  const plusStyle: CSSProperties = {
    userSelect: 'none',
    transition: 'background 20ms ease-in',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto',
    ...style,
  };

  return (
    <Action
      {...props}
      ref={ref}
      className={cn('yoo-plus-button-action', className)}
      title="Add block"
      style={plusStyle}
    >
      {icons?.plus || <Plus width={16} height={24} strokeWidth={2} />}
      {props.children}
    </Action>
  );
});

PlusAction.displayName = 'FloatingBlockActions.PlusAction';

export type DragActionProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

// DragAction component
const DragAction = React.forwardRef<HTMLButtonElement, DragActionProps>(({ className, style, ...props }, ref) => {
  const { icons } = useFloatingBlockActionsContext();

  const dragStyle: CSSProperties = {
    userSelect: 'none',
    transition: 'background 20ms ease-in',
    cursor: 'grab',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      // Set the ref for the component
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  return (
    <Action
      {...props}
      ref={setRefs}
      style={dragStyle}
      title="Drag block"
      className={cn('yoo-drag-button-action', className)}
    >
      {icons?.drag || <GripVertical size={14} strokeWidth={2} />}
      {props.children}
    </Action>
  );
});

DragAction.displayName = 'FloatingBlockActions.DragAction';

export type ActionProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

// Action component for button actions
const Action = React.forwardRef<HTMLButtonElement, ActionProps>(({ className, children, ...rest }, ref) => {
  return (
    <button ref={ref} type="button" className={cn('yoo-button-action', className)} {...rest}>
      {children}
    </button>
  );
});

Action.displayName = 'FloatingBlockActions.Action';

// Main component with subcomponents
const FloatingBlockActions = Object.assign(Root, {
  Root,
  PlusAction,
  DragAction,
  Action,
});

export { FloatingBlockActions };
