import { forwardRef, type ReactNode, type CSSProperties, memo } from 'react';
import './floating-block-actions.css';
import { useFloatingBlockActionsStore } from './store';

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

const FloatingBlockActionsRoot = memo(({ children, className }: FloatingBlockActionsRootProps) => {
  const { setReference, styles } = useFloatingBlockActionsStore();

  return (
    <div
      ref={setReference}
      className={`yoopta-ui-floating-block-actions ${className}`}
      style={styles}
      contentEditable={false}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
});
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
