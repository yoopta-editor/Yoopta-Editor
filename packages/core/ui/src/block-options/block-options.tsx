import { forwardRef, type ReactNode, memo, CSSProperties } from 'react';
import { UI } from '@yoopta/editor';
import './block-options.css';
import { useBlockOptions } from './hooks';

const Portal = UI.Portal;
const Overlay = UI.Overlay;

type BlockOptionsRootProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onClose?: () => void;
};

type BlockOptionsContentProps = {
  children: ReactNode;
  className?: string;
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

const BlockOptionsRoot = memo(
  ({ children, style: styleProp, onClose: onCloseProp, className = '' }: BlockOptionsRootProps) => {
    const { close, style: floatingStyle, isOpen, setFloatingRef } = useBlockOptions();

    const style = {
      ...floatingStyle,
      ...styleProp,
    };

    if (!isOpen) return null;

    const onClose = () => {
      close();
      onCloseProp?.();
    };

    return (
      <Portal id="yoo-block-options-portal">
        <Overlay lockScroll className="yoo-editor-z-[100]" onClick={onClose}>
          <div
            ref={setFloatingRef}
            className={`yoopta-ui-block-options ${className}`}
            style={style}
            contentEditable={false}>
            {children}
          </div>
        </Overlay>
      </Portal>
    );
  },
);
BlockOptionsRoot.displayName = 'BlockOptions.Root';

const BlockOptionsContent = memo(({ children, className = '' }: BlockOptionsContentProps) => {
  return <div className={`yoopta-ui-block-options-content ${className}`}>{children}</div>;
});
BlockOptionsContent.displayName = 'BlockOptions.Content';

const BlockOptionsGroup = forwardRef<HTMLDivElement, BlockOptionsGroupProps>(
  ({ children, className = '' }, ref) => {
    return (
      <div ref={ref} className={`yoopta-ui-block-options-group ${className}`}>
        {children}
      </div>
    );
  },
);
BlockOptionsGroup.displayName = 'BlockOptions.Group';

const BlockOptionsButton = forwardRef<HTMLButtonElement, BlockOptionsButtonProps>(
  ({ children, onClick, className = '', disabled, icon, variant = 'default', ...props }, ref) => {
    return (
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
    );
  },
);
BlockOptionsButton.displayName = 'BlockOptions.Button';

const BlockOptionsSeparator = forwardRef<HTMLDivElement, BlockOptionsSeparatorProps>(
  ({ className = '' }, ref) => {
    return <div ref={ref} className={`yoopta-ui-block-options-separator ${className}`} />;
  },
);
BlockOptionsSeparator.displayName = 'BlockOptions.Separator';

export const BlockOptions = Object.assign(BlockOptionsRoot, {
  Root: BlockOptionsRoot,
  Content: BlockOptionsContent,
  Group: BlockOptionsGroup,
  Button: BlockOptionsButton,
  Separator: BlockOptionsSeparator,
});
