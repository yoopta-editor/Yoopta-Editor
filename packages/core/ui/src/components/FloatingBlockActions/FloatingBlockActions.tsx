import React, { CSSProperties, useCallback } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFloatingBlockActions } from './useFloatingBlockActions';

export interface FloatingBlockActionsProps {
  readOnly?: boolean;
  hideDelay?: number;
  throttleDelay?: number;
  className?: string;
  style?: React.CSSProperties;
  onBlockHover?: (blockId: string | null) => void;
  onPlusClick?: (blockId: string) => void;
  onDragClick?: (blockId: string) => void;
  onDragStart?: (event: React.MouseEvent, blockId: string) => void;
  icons?: {
    plus?: React.ReactNode;
    drag?: React.ReactNode;
  };
  actions?: Array<'plus' | 'drag' | React.ReactNode>;
  animate?: boolean;
  portalId?: string;
}

type PlusButtonProps = {
  handlers: { onPlusClick: () => void };
  icon: React.ReactNode;
};

const plusStyle: CSSProperties = {
  userSelect: 'none',
  transition: 'background 20ms ease-in',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'auto',
};

const PlusButton = ({ handlers, icon }: PlusButtonProps) => {
  return (
    <button
      type="button"
      onClick={handlers.onPlusClick}
      className="yoo-plus-button-action"
      title="Add block"
      style={plusStyle}
    >
      {icon || <Plus width={16} height={24} strokeWidth={2} />}
    </button>
  );
};

type DragButtonProps = {
  handlers: { onDragClick: (event: React.MouseEvent) => void; onDragStart: (event: React.MouseEvent) => void };
  icon: React.ReactNode;
};

const dragStyle: CSSProperties = {
  userSelect: 'none',
  transition: 'background 20ms ease-in',
  cursor: 'grab',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const DragButton = ({ handlers, icon }: DragButtonProps) => {
  return (
    <button
      type="button"
      onClick={handlers.onDragClick}
      onMouseDown={handlers.onDragStart}
      style={dragStyle}
      title="Drag block"
      className="yoo-drag-button-action"
    >
      {icon || <GripVertical size={14} strokeWidth={2} />}
    </button>
  );
};

const FloatingBlockActions = React.forwardRef<HTMLDivElement, FloatingBlockActionsProps>(
  (
    {
      readOnly = false,
      hideDelay = 150,
      throttleDelay = 100,
      className,
      style,
      onBlockHover,
      onPlusClick,
      onDragClick,
      onDragStart,
      icons,
      actions,
      animate = true,
      portalId = 'floating-block-actions',
    },
    ref,
  ) => {
    const { hoveredBlockId, position, visible, actionsRef, handlers } = useFloatingBlockActions({
      readOnly,
      hideDelay,
      throttleDelay,
      onBlockHover,
      onPlusClick,
      onDragClick,
      onDragStart,
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

    if (!visible && !hoveredBlockId) {
      return null;
    }

    const renderAction = (action: 'plus' | 'drag' | React.ReactNode, index: number) => {
      if (action === 'plus') {
        return <PlusButton key={`plus-${index}`} handlers={handlers} icon={icons?.plus} />;
      }
      if (action === 'drag') {
        return <DragButton key={`drag-${index}`} handlers={handlers} icon={icons?.drag} />;
      }

      return React.isValidElement(action) ? React.cloneElement(action, { key: `custom-${index}` }) : action;
    };

    return (
      <div
        ref={setRefs}
        className={cn('yoo-floating-block-actions', className)}
        style={containerStyles}
        contentEditable={false}
        data-portal-id={portalId}
      >
        {actions?.map((action, index) => renderAction(action, index))}
      </div>
    );
  },
);

FloatingBlockActions.displayName = 'FloatingBlockActions';

export { FloatingBlockActions };
