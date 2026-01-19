import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { Portal } from '../portal';

export type ToolbarRootProps = Partial<HTMLAttributes<HTMLDivElement>>;

const ToolbarRoot = forwardRef<HTMLDivElement, ToolbarRootProps>(
  ({ className, children, ...props }, ref) => (
    <Portal id="yoopta-ui-toolbar-portal">
      <div
        ref={ref}
        className={`yoopta-ui-toolbar ${className || ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        {...props}>
        {children}
      </div>
    </Portal>
  ),
);
ToolbarRoot.displayName = 'Toolbar.Root';

export type ToolbarGroupProps = {} & HTMLAttributes<HTMLDivElement>;

const ToolbarGroup = forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`yoopta-ui-toolbar-group ${className}`} {...props}>
      {children}
    </div>
  ),
);
ToolbarGroup.displayName = 'Toolbar.Group';

export type ToolbarSeparatorProps = {} & HTMLAttributes<HTMLDivElement>;

const ToolbarSeparator = forwardRef<HTMLDivElement, ToolbarSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`yoopta-ui-toolbar-separator ${className}`} {...props} />
  ),
);
ToolbarSeparator.displayName = 'Toolbar.Separator';

// Button component
export type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
} & HTMLAttributes<HTMLButtonElement>;

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, children, active, disabled, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      data-active={active}
      className={`yoopta-ui-toolbar-button ${className}`}
      {...props}>
      {children}
    </button>
  ),
);

ToolbarButton.displayName = 'Toolbar.Button';

// Export compound component
export const Toolbar = {
  Root: ToolbarRoot,
  Group: ToolbarGroup,
  Separator: ToolbarSeparator,
  Button: ToolbarButton,
};
