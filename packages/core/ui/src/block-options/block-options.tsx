import { forwardRef, type ReactNode, useEffect, useCallback } from 'react';
import { UI } from '@yoopta/editor';
import { useBlockOptions } from './hooks';
import './block-options.css';

const Portal = UI.Portal;
const Overlay = UI.Overlay;

// ============ Types ============

type BlockOptionsRootProps = {
  children: ReactNode;
  className?: string;
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

// ============ Root Component ============

const BlockOptionsRoot = forwardRef<HTMLDivElement, BlockOptionsRootProps>(
  ({ children, className = '' }, ref) => {
    const { isOpen, isMounted, style, setFloatingRef, close } = useBlockOptions();

    // Close on Escape key
    useEffect(() => {
      if (!isOpen) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          close();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen, close]);

    // Combine forwarded ref with setFloatingRef
    const combinedRef = useCallback(
      (node: HTMLDivElement | null) => {
        // Call setFloatingRef (for Floating UI)
        setFloatingRef(node);

        // Call forwarded ref (if provided)
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [setFloatingRef, ref],
    );

    // Use isMounted instead of isOpen for rendering
    // This allows transition animation to complete
    if (!isMounted) return null;

    return (
      <Portal id="yoo-block-options-portal">
        <Overlay lockScroll className="yoo-editor-z-[100]" onClick={close}>
          <div
            ref={combinedRef}
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

// ============ Content Component ============

const BlockOptionsContent = forwardRef<HTMLDivElement, BlockOptionsContentProps>(
  ({ children, className = '' }, ref) => {
    return (
      <div ref={ref} className={`yoopta-ui-block-options-content ${className}`}>
        {children}
      </div>
    );
  },
);

BlockOptionsContent.displayName = 'BlockOptions.Content';

// ============ Group Component ============

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

// ============ Button Component ============

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

// ============ Separator Component ============

const BlockOptionsSeparator = forwardRef<HTMLDivElement, BlockOptionsSeparatorProps>(
  ({ className = '' }, ref) => {
    return <div ref={ref} className={`yoopta-ui-block-options-separator ${className}`} />;
  },
);

BlockOptionsSeparator.displayName = 'BlockOptions.Separator';

// ============ Compound Component ============

export const BlockOptions = Object.assign(BlockOptionsRoot, {
  Root: BlockOptionsRoot,
  Content: BlockOptionsContent,
  Group: BlockOptionsGroup,
  Button: BlockOptionsButton,
  Separator: BlockOptionsSeparator,
});
