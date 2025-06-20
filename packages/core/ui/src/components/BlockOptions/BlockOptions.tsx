import React, { createContext, useContext, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Portal } from '../Portal/Portal';
import { Overlay } from '../Overlay/Overlay';

export interface BlockOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  refs: any;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
}

interface BlockOptionsContextValue {
  isOpen: boolean;
  onClose: () => void;
  refs: any;
  style?: React.CSSProperties;
}

const BlockOptionsContext = createContext<BlockOptionsContextValue | null>(null);

// Root component
const Root = forwardRef<HTMLDivElement, BlockOptionsProps>(
  ({ isOpen, onClose, refs, style, children, className }, ref) => {
    if (!isOpen) return null;

    const contextValue: BlockOptionsContextValue = {
      isOpen,
      onClose,
      refs,
      style,
    };

    return (
      <BlockOptionsContext.Provider value={contextValue}>
        <Portal id="yoo-block-options-portal">
          <Overlay>
            <div
              ref={(node) => {
                refs.setFloating(node);
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
              }}
              style={style}
              className={cn('yoo-block-options-root', className)}
              contentEditable={false}
            >
              {children}
            </div>
          </Overlay>
        </Portal>
      </BlockOptionsContext.Provider>
    );
  },
);

Root.displayName = 'BlockOptions.Root';

// Content component
const Content = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
  }
>(({ className, style, children }, ref) => {
  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      className={cn('yoo-block-options-content', className)}
      style={style}
    >
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
}

const Button = forwardRef<HTMLButtonElement, BlockOptionsButtonProps>(
  ({ icon, children, className, style, ...rest }, ref) => {
    return (
      <button ref={ref} type="button" className={cn('yoo-block-options-button', className)} style={style} {...rest}>
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
