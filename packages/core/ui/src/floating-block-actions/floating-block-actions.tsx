import { forwardRef, type ReactNode, type CSSProperties } from 'react';
import { useFloatingBlockActions } from './hooks';
import './floating-block-actions.css';

// ============ Types ============

type FloatingBlockActionsRootProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type FloatingBlockActionsButtonProps = {
  children: ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  title?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

// ============ Root Component ============

const FloatingBlockActionsRoot = forwardRef<HTMLDivElement, FloatingBlockActionsRootProps>(
  ({ children, className = '' }, ref) => {
    const { isVisible, style, blockActionsRef } = useFloatingBlockActions();

    return (
      <div
        ref={(node) => {
          if (blockActionsRef) {
            (blockActionsRef as any).current = node;
          }
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`yoopta-floating-block-actions ${className}`}
        style={{
          pointerEvents: isVisible ? 'auto' : 'none',
          ...style,
        }}
        contentEditable={false}>
        {children}
      </div>
    );
  },
);

FloatingBlockActionsRoot.displayName = 'FloatingBlockActions.Root';

// ============ Button Component ============

const FloatingBlockActionsButton = forwardRef<HTMLButtonElement, FloatingBlockActionsButtonProps>(
  ({ children, onClick, className = '', disabled, title, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`yoopta-floating-action-button ${className}`}
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-label={title}
        {...props}>
        {children}
      </button>
    );
  },
);

FloatingBlockActionsButton.displayName = 'FloatingBlockActions.Button';

// ============ Compound Component ============

export const FloatingBlockActions = Object.assign(FloatingBlockActionsRoot, {
  Root: FloatingBlockActionsRoot,
  Button: FloatingBlockActionsButton,
});
