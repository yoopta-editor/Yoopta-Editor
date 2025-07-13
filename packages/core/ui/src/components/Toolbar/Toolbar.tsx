import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Portal } from '../Portal/Portal';
import { useToolbarContext } from './ToolbarContext';

export interface ToolbarProps {
  children?: React.ReactNode;
  className?: string;
}

// Root component
const Root = forwardRef<HTMLDivElement, ToolbarProps>(({ children, className }, ref) => {
  const { isOpen, style, setFloatingRef } = useToolbarContext();

  const onRef = (node: HTMLDivElement | null) => {
    setFloatingRef(node);

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  if (!isOpen) return null;

  return (
    <Portal id="yoo-toolbar-portal">
      <div ref={onRef} style={style} className={cn('yoo-toolbar-root', className)}>
        {children}
      </div>
    </Portal>
  );
});

Root.displayName = 'Toolbar.Root';

// Content component
const Content = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children: React.ReactNode;
  }
>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={cn('yoo-toolbar-content', className)}>
      {children}
    </div>
  );
});

Content.displayName = 'Toolbar.Content';

// Group component
const Group = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children: React.ReactNode;
  }
>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={cn('yoo-toolbar-group', className)}>
      {children}
    </div>
  );
});

Group.displayName = 'Toolbar.Group';

// Button component
export interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ icon, children, className, variant = 'default', size = 'md', active, disabled, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          'yoo-toolbar-button',
          `yoo-toolbar-button-${variant}`,
          `yoo-toolbar-button-${size}`,
          active && 'yoo-toolbar-button-active',
          disabled && 'yoo-toolbar-button-disabled',
          className,
        )}
        {...rest}
      >
        {icon && <span className="yoo-toolbar-icon">{icon}</span>}
        {children && <span className="yoo-toolbar-text">{children}</span>}
      </button>
    );
  },
);

Button.displayName = 'Toolbar.Button';

// Toggle component
export interface ToolbarToggleProps extends ToolbarButtonProps {
  value?: string;
  pressed?: boolean;
}

const Toggle = forwardRef<HTMLButtonElement, ToolbarToggleProps>(
  ({ icon, children, className, variant = 'default', size = 'md', active, pressed, disabled, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-pressed={pressed}
        className={cn(
          'yoo-toolbar-toggle',
          `yoo-toolbar-toggle-${variant}`,
          `yoo-toolbar-toggle-${size}`,
          (active || pressed) && 'yoo-toolbar-toggle-active',
          disabled && 'yoo-toolbar-toggle-disabled',
          className,
        )}
        {...rest}
      >
        {icon && <span className="yoo-toolbar-icon">{icon}</span>}
        {children && <span className="yoo-toolbar-text">{children}</span>}
      </button>
    );
  },
);

Toggle.displayName = 'Toolbar.Toggle';

// Separator component
const Separator = forwardRef<
  HTMLDivElement,
  {
    className?: string;
  }
>(({ className }, ref) => {
  return <div ref={ref} className={cn('yoo-toolbar-separator', className)} />;
});

Separator.displayName = 'Toolbar.Separator';

// Main component with subcomponents
const Toolbar = Object.assign(Root, {
  Root,
  Content,
  Group,
  Button,
  Toggle,
  Separator,
});

export { Toolbar };
