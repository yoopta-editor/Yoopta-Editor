import { forwardRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { Overlay } from '../overlay';
import { Portal } from '../portal';
import './block-options.css';

type BlockOptionsRootProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onClose?: () => void;
};

type BlockOptionsGroupProps = {
  children: ReactNode;
  className?: string;
};

type BlockOptionsButtonProps = {
  children: ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  variant?: 'default' | 'destructive';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type BlockOptionsSeparatorProps = {
  className?: string;
};

const BlockOptionsRoot = forwardRef<HTMLDivElement, BlockOptionsRootProps>(
  ({ children, className = '', onClose, ...props }, ref) => (
    <Portal id="yoopta-ui-block-options-portal">
      <Overlay lockScroll onMouseDown={(e) => e.stopPropagation()} onClick={onClose}>
        <div
          ref={ref}
          className={`yoopta-ui-block-options ${className}`}
          contentEditable={false}
          {...props}>
          {children}
        </div>
      </Overlay>
    </Portal>
  ),
);

BlockOptionsRoot.displayName = 'BlockOptions.Root';

const BlockOptionsGroup = forwardRef<HTMLDivElement, BlockOptionsGroupProps>(
  ({ children, className = '' }, ref) => (
    <div ref={ref} className={`yoopta-ui-block-options-group ${className}`}>
      {children}
    </div>
  ),
);
BlockOptionsGroup.displayName = 'BlockOptions.Group';

const BlockOptionsButton = forwardRef<HTMLButtonElement, BlockOptionsButtonProps>(
  ({ children, onClick, className = '', disabled, icon, variant = 'default', ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={`yoopta-ui-block-options-button yoopta-ui-block-options-button-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}>
      {icon && <span className="yoopta-ui-block-options-button-icon">{icon}</span>}
      <span className="yoopta-ui-block-options-button-text">{children}</span>
    </button>
  ),
);
BlockOptionsButton.displayName = 'BlockOptions.Button';

const BlockOptionsSeparator = forwardRef<HTMLDivElement, BlockOptionsSeparatorProps>(
  ({ className = '' }, ref) => (
    <div ref={ref} className={`yoopta-ui-block-options-separator ${className}`} />
  ),
);
BlockOptionsSeparator.displayName = 'BlockOptions.Separator';

export const BlockOptions = Object.assign(BlockOptionsRoot, {
  Root: BlockOptionsRoot,
  Group: BlockOptionsGroup,
  Button: BlockOptionsButton,
  Separator: BlockOptionsSeparator,
});
