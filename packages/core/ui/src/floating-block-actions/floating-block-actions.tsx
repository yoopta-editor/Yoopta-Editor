import { forwardRef, type ReactNode, type CSSProperties } from 'react';
import './floating-block-actions.css';

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

const FloatingBlockActionsRoot = forwardRef<HTMLDivElement, FloatingBlockActionsRootProps>(
  ({ children, className = '', style: styleProp }, ref) => {
    return (
      <div
        ref={ref}
        className={`yoopta-ui-floating-block-actions ${className}`}
        style={styleProp}
        contentEditable={false}>
        {children}
      </div>
    );
  },
);
FloatingBlockActionsRoot.displayName = 'FloatingBlockActions.Root';

const FloatingBlockActionsButton = forwardRef<HTMLButtonElement, FloatingBlockActionsButtonProps>(
  ({ children, onClick, className = '', disabled, title, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`yoopta-ui-floating-action-button ${className}`}
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

export const FloatingBlockActions = Object.assign(FloatingBlockActionsRoot, {
  Root: FloatingBlockActionsRoot,
  Button: FloatingBlockActionsButton,
});
