import {
  ReactNode,
  forwardRef,
  CSSProperties,
  ReactElement,
  cloneElement,
  isValidElement,
} from 'react';
import { ActionMenuItem } from '../action-menu-list/types';

// ====================================
// Root Component
// ====================================
type RootProps = {
  children: ReactNode;
  style?: CSSProperties;
};

const Root = forwardRef<HTMLDivElement, RootProps>(({ children, style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="listbox"
      style={style}
      className="yoopta-ui-slash-action-menu-list-content"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      {...props}>
      {children}
    </div>
  );
});

Root.displayName = 'SlashActionMenuList.Root';

// ====================================
// Group Component (with floating container)
// ====================================
type GroupProps = {
  children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Group = forwardRef<HTMLDivElement, GroupProps>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} className="yoopta-ui-slash-action-menu-list-group" {...props}>
      {children}
    </div>
  );
});

Group.displayName = 'SlashActionMenuList.Group';

// ====================================
// Item Component
// ====================================
type ItemProps = {
  action: ActionMenuItem;
  selected?: boolean;
  icon?: string | ReactNode | ReactElement;
} & React.HTMLAttributes<HTMLButtonElement>;

const iconStyles = {};

const Item = forwardRef<HTMLButtonElement, ItemProps>(
  ({ action, selected, icon: iconProp, ...props }, ref) => {
    const renderIcon = (icon) => {
      if (!icon) return null;

      if (typeof icon === 'string') {
        return <img src={icon} alt="icon" style={iconStyles} />;
      }

      if (isValidElement(icon)) {
        return cloneElement<any>(icon, { style: iconStyles });
      }

      const IconComponent = icon as any;
      return <IconComponent style={iconStyles} />;
    };

    return (
      <button
        ref={ref}
        className={`yoopta-ui-slash-action-menu-list-item ${selected ? 'selected' : ''}`}
        {...props}>
        {iconProp && (
          <div className="yoopta-ui-slash-action-menu-list-item-icon">{renderIcon(iconProp)}</div>
        )}
        <div className="yoopta-ui-slash-action-menu-list-item-content">
          <div className="yoopta-ui-slash-action-menu-list-item-title">{action.title}</div>
          {action.description && (
            <div className="yoopta-ui-slash-action-menu-list-item-description">
              {action.description}
            </div>
          )}
        </div>
      </button>
    );
  },
);

Item.displayName = 'SlashActionMenuList.Item';

// ====================================
// Empty Component
// ====================================
const Empty = () => {
  return (
    <div className="yoopta-ui-slash-action-menu-list-empty">
      <span>No results</span>
    </div>
  );
};

export const SlashActionMenuList = {
  Root,
  Group,
  Item,
  Empty,
};
