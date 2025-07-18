import './block-options.css';

import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Portal } from '../Portal/Portal';
import { Overlay } from '../Overlay/Overlay';
import { useBlockOptionsContext } from './BlockOptionsContext';

export interface BlockOptionsProps {
  children?: React.ReactNode;
  className?: string;
}

// Root component
const Root = forwardRef<HTMLDivElement, BlockOptionsProps>(({ children, className }, ref) => {
  const { isOpen, close, setFloatingRef, style } = useBlockOptionsContext();

  const onRef = (node: HTMLDivElement | null) => {
    setFloatingRef(node);

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return isOpen ? (
    <Portal id="yoo-block-options-portal">
      <Overlay lockScroll onClick={close}>
        <div ref={onRef} style={style} className={cn('yoo-block-options-root', className)} contentEditable={false}>
          {children}
        </div>
      </Overlay>
    </Portal>
  ) : null;
});

Root.displayName = 'BlockOptions.Root';

// Content component
const Content = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children: React.ReactNode;
  }
>(({ className, children }, ref) => {
  return (
    <div ref={ref} onClick={(e) => e.stopPropagation()} className={cn('yoo-block-options-content', className)}>
      {children}
    </div>
  );
});

Content.displayName = 'BlockOptions.Content';

// Group component
const Group = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
  }
>(({ className, style, children }, ref) => {
  return (
    <div ref={ref} className={cn('yoo-block-options-group', className)} style={style}>
      {children}
    </div>
  );
});

Group.displayName = 'BlockOptions.Group';

// Item component
const Item = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
  }
>(({ className, style, children }, ref) => {
  return (
    <div ref={ref} className={cn('yoo-block-options-item', className)} style={style}>
      {children}
    </div>
  );
});

Item.displayName = 'BlockOptions.Item';

// Button component
export interface BlockOptionsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'destructive';
  size?: 'sm' | 'md';
}

const Button = forwardRef<HTMLButtonElement, BlockOptionsButtonProps>(
  ({ icon, children, className, style, variant = 'default', size = 'md', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'yoo-block-options-button',
          `yoo-block-options-button-${variant}`,
          `yoo-block-options-button-${size}`,
          className,
        )}
        style={style}
        {...rest}
      >
        {icon && <span className="yoo-block-options-icon">{icon}</span>}
        <span className="yoo-block-options-text">{children}</span>
      </button>
    );
  },
);

Button.displayName = 'BlockOptions.Button';

// Separator component
const Separator = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    style?: React.CSSProperties;
  }
>(({ className, style }, ref) => {
  return <div ref={ref} className={cn('yoo-block-options-separator', className)} style={style} />;
});

Separator.displayName = 'BlockOptions.Separator';

// Main component with subcomponents
const BlockOptions = Object.assign(Root, {
  Root,
  Content,
  Group,
  Item,
  Button,
  Separator,
});

export { BlockOptions };
