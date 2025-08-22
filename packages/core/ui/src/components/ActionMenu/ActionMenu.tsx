import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Portal } from '../Portal/Portal';
import { useActionMenuContext } from './ActionMenuContext';

export interface ActionMenuProps {
  children?: React.ReactNode;
  className?: string;
}

const Root = forwardRef<HTMLDivElement, ActionMenuProps>(({ children, className }, ref) => {
  const { isOpen, style, setFloatingRef } = useActionMenuContext();

  const onRef = (node: HTMLDivElement | null) => {
    setFloatingRef(node);

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <Portal id="yoo-action-menu-portal">
      {isOpen && (
        <div
          ref={onRef}
          style={style}
          className={cn('yoo-action-menu-root', className)}
          data-state={isOpen ? 'open' : 'closed'}
        >
          {children}
        </div>
      )}
    </Portal>
  );
});

Root.displayName = 'ActionMenu.Root';

const Content = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children: React.ReactNode;
  }
>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={cn('yoo-action-menu-content', className)}>
      {children}
    </div>
  );
});

Content.displayName = 'ActionMenu.Content';

const List = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children: React.ReactNode;
  }
>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={cn('yoo-action-menu-list', className)}>
      {children}
    </div>
  );
});

List.displayName = 'ActionMenu.List';

export interface ActionMenuItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  selected?: boolean;
  className?: string;
  variant?: 'default' | 'small';
  type: string;
}

const Item = forwardRef<HTMLButtonElement, ActionMenuItemProps>(
  ({ icon, title, description, selected, className, variant = 'default', type, ...rest }, ref) => {
    const isSmall = variant === 'small';

    const iconWrapStyles = {
      minWidth: isSmall ? '28px' : '40px',
      width: isSmall ? '40px' : '40px',
      height: isSmall ? '28px' : '40px',
    };

    // data-action-menu-item

    const iconStyles = {
      transform: isSmall ? 'scale(0.75)' : 'scale(1)',
    };

    const renderIcon = (Icon: any) => {
      if (!Icon) return null;
      if (typeof Icon === 'string') return <img src={Icon} alt="icon" style={iconStyles} />;
      if (React.isValidElement(Icon)) return React.cloneElement<any>(Icon, { style: iconStyles });
      return <Icon style={iconStyles} />;
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-selected={selected}
        className={cn('yoo-action-menu-item', selected && 'yoo-action-menu-item-selected', className)}
        data-action-menu-item
        data-action-menu-item-type={type}
        {...rest}
      >
        <div style={iconWrapStyles} className="yoo-action-menu-icon-wrapper">
          {renderIcon(icon)}
        </div>
        <div className="yoo-action-menu-item-content">
          <div className="yoo-action-menu-item-title">{title}</div>
          {!isSmall && description && <div className="yoo-action-menu-item-description">{description}</div>}
        </div>
      </button>
    );
  },
);

Item.displayName = 'ActionMenu.Item';

const Empty = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children?: React.ReactNode;
  }
>(({ className, children = 'No actions available' }, ref) => {
  return (
    <div ref={ref} className={cn('yoo-action-menu-empty', className)}>
      {children}
    </div>
  );
});

Empty.displayName = 'ActionMenu.Empty';

const ActionMenu = Object.assign(Root, {
  Root,
  Content,
  List,
  Item,
  Empty,
});

export { ActionMenu };
