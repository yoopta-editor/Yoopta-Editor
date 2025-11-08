import { forwardRef, HTMLAttributes, cloneElement, isValidElement } from 'react';
import { UI } from '@yoopta/editor';
import { useActionMenuList } from './hooks';
import type { ActionMenuListProps, ActionMenuItem } from './types';

const { Portal } = UI;

export type ActionMenuListRootProps = ActionMenuListProps & HTMLAttributes<HTMLDivElement>;

const ActionMenuListRoot = ({
  children,
  items,
  trigger,
  view,
  mode,
  render,
  className,
  ...props
}: ActionMenuListRootProps) => {
  const { setFloatingRef, isMounted, styles } = useActionMenuList({ items, trigger, view, mode });

  if (!isMounted) return null;

  return (
    <Portal id="yoo-action-menu-list-portal">
      <div
        ref={setFloatingRef}
        style={styles}
        className={`yoopta-ui-action-menu-list ${className || ''}`}
        {...props}>
        {children}
      </div>
    </Portal>
  );
};
ActionMenuListRoot.displayName = 'ActionMenuList.Root';

export type ActionMenuListContentProps = HTMLAttributes<HTMLDivElement> & {
  view?: 'small' | 'default';
};

const ActionMenuListContent = forwardRef<HTMLDivElement, ActionMenuListContentProps>(
  ({ children, view = 'default', className, style, ...props }, ref) => {
    const maxWidth = view === 'small' ? '200px' : '270px';

    return (
      <div
        ref={ref}
        role="listbox"
        style={{ maxWidth, ...style }}
        className={`yoopta-ui-action-menu-list-content ${className || ''}`}
        {...props}>
        {children}
      </div>
    );
  },
);
ActionMenuListContent.displayName = 'ActionMenuList.Content';

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

export type ActionMenuListItemProps = HTMLAttributes<HTMLButtonElement> & {
  action: ActionMenuItem;
  view?: 'small' | 'default';
  selected?: boolean;
};

const ActionMenuListItem = forwardRef<HTMLButtonElement, ActionMenuListItemProps>(
  ({ action, view = 'default', selected, className, children, ...props }, ref) => {
    const isViewSmall = view === 'small';

    const iconWrapStyles = {
      minWidth: isViewSmall ? '28px' : '40px',
      width: isViewSmall ? '28px' : '40px',
      height: isViewSmall ? '28px' : '40px',
    };

    const iconStyles = {
      transform: isViewSmall ? 'scale(0.75)' : 'scale(1)',
    };

    const renderIcon = (Icon: any) => {
      if (!Icon) return null;
      if (typeof Icon === 'string') return <img src={Icon} alt="icon" style={iconStyles} />;
      if (isValidElement(Icon)) return cloneElement<any>(Icon, { style: iconStyles });
      return <Icon style={iconStyles} />;
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-selected={selected}
        className={`yoopta-ui-action-menu-list-item ${className || ''}`}
        {...props}>
        <div style={iconWrapStyles} className="yoopta-ui-action-menu-list-item-icon">
          {renderIcon(action.icon)}
        </div>
        <div className="yoopta-ui-action-menu-list-item-content">
          <div className="yoopta-ui-action-menu-list-item-title">{action.title}</div>
          {!isViewSmall && action.description && (
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
  Content: ActionMenuListContent,
  Group: ActionMenuListGroup,
  Item: ActionMenuListItem,
  Empty: ActionMenuListEmpty,
};
