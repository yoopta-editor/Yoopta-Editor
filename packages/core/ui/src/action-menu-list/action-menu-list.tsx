import {
  forwardRef,
  HTMLAttributes,
  cloneElement,
  isValidElement,
  CSSProperties,
  ReactNode,
} from 'react';
import type { ActionMenuItem } from './types';

// ====================================
// Root Component
// ====================================
export type ActionMenuListRootProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  style?: CSSProperties;
};

const ActionMenuListRoot = forwardRef<HTMLDivElement, ActionMenuListRootProps>(
  ({ children, style, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="listbox"
        style={style}
        className={`yoopta-ui-action-menu-list-content ${className || ''}`}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        {...props}>
        {children}
      </div>
    );
  },
);
ActionMenuListRoot.displayName = 'ActionMenuList.Root';

// ====================================
// Group Component
// ====================================
export type ActionMenuListGroupProps = HTMLAttributes<HTMLDivElement>;

const ActionMenuListGroup = forwardRef<HTMLDivElement, ActionMenuListGroupProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={`yoopta-ui-action-menu-list-group ${className || ''}`} {...props}>
        {children}
      </div>
    );
  },
);
ActionMenuListGroup.displayName = 'ActionMenuList.Group';

// ====================================
// Item Component
// ====================================
export type ActionMenuListItemProps = HTMLAttributes<HTMLButtonElement> & {
  action: ActionMenuItem;
  selected?: boolean;
  icon?: string | ReactNode;
};

const ActionMenuListItem = forwardRef<HTMLButtonElement, ActionMenuListItemProps>(
  ({ action, selected, icon: iconProp, className, ...props }, ref) => {
    const renderIcon = (icon: any) => {
      if (!icon) return null;

      if (typeof icon === 'string') {
        return <img src={icon} alt="icon" />;
      }

      if (isValidElement(icon)) {
        return cloneElement<any>(icon);
      }

      const IconComponent = icon as any;
      return <IconComponent />;
    };

    return (
      <button
        ref={ref}
        type="button"
        className={`yoopta-ui-action-menu-list-item ${selected ? 'selected' : ''} ${
          className || ''
        }`}
        {...props}>
        {iconProp && (
          <div className="yoopta-ui-action-menu-list-item-icon">{renderIcon(iconProp)}</div>
        )}
        <div className="yoopta-ui-action-menu-list-item-content">
          <div className="yoopta-ui-action-menu-list-item-title">{action.title}</div>
          {action.description && (
            <div className="yoopta-ui-action-menu-list-item-description">{action.description}</div>
          )}
        </div>
      </button>
    );
  },
);
ActionMenuListItem.displayName = 'ActionMenuList.Item';

export type ActionMenuListEmptyProps = HTMLAttributes<HTMLDivElement>;

const ActionMenuListEmpty = forwardRef<HTMLDivElement, ActionMenuListEmptyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={`yoopta-ui-action-menu-list-empty ${className || ''}`} {...props}>
        {children || 'No actions available'}
      </div>
    );
  },
);
ActionMenuListEmpty.displayName = 'ActionMenuList.Empty';

export const ActionMenuList = {
  Root: ActionMenuListRoot,
  Group: ActionMenuListGroup,
  Item: ActionMenuListItem,
  Empty: ActionMenuListEmpty,
};
