import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cloneElement, forwardRef, isValidElement, useCallback, useMemo, useState } from 'react';
import type { Placement } from '@floating-ui/react';
import { autoUpdate, flip, offset, shift, useFloating, useMergeRefs, useTransitionStyles } from '@floating-ui/react';
import { Blocks, useYooptaEditor } from '@yoopta/editor';

import { ActionMenuListContext, useActionMenuListContext } from './context';
import type { ActionMenuItem } from './types';
import { filterToggleActions, mapActionMenuItems } from './utils';
import { Portal } from '../portal';
import './action-menu-list.css';

// ============================================================================
// Types
// ============================================================================

type ActionMenuListApi = {
  /** Available actions from editor plugins */
  actions: ActionMenuItem[];
  /** Currently selected action */
  selectedAction: ActionMenuItem | null;
  /** Execute action (toggle block type) */
  onSelect: (type: string) => void;
  /** Whether actions list is empty */
  empty: boolean;
};

type ActionMenuListRootProps = {
  children: ReactNode | ((api: ActionMenuListApi) => ReactNode);
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Anchor element for positioning */
  anchor?: HTMLElement | null;
  /** Block ID to operate on (for toggle mode) */
  blockId?: string | null;
  /** View mode - 'small' for compact, 'default' for full */
  view?: 'small' | 'default';
  /** Placement relative to anchor */
  placement?: Placement;
  className?: string;
};

// ============================================================================
// ActionMenuList Root
// ============================================================================

const ActionMenuListRoot = ({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  anchor = null,
  blockId = null,
  view = 'default',
  placement = 'bottom-start',
  className = '',
}: ActionMenuListRootProps) => {
  const editor = useYooptaEditor();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  // Get available actions from editor plugins
  const actions = useMemo(
    () => mapActionMenuItems(editor).filter((item) => filterToggleActions(editor, item.type)),
    [editor],
  );

  const [selectedAction, setSelectedAction] = useState<ActionMenuItem | null>(actions[0] ?? null);

  // Floating UI setup
  const { refs, floatingStyles, context } = useFloating({
    elements: { reference: anchor },
    placement,
    open: isOpen,
    middleware: [flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 100,
  });

  // Combined styles with view-specific width
  const combinedStyles: CSSProperties = useMemo(
    () => ({
      ...floatingStyles,
      ...transitionStyles,
      minWidth: view === 'small' ? 200 : 244,
    }),
    [floatingStyles, transitionStyles, view],
  );

  // Close menu
  const close = useCallback(() => {
    if (!isControlled) {
      setUncontrolledOpen(false);
    }
    controlledOnOpenChange?.(false);
    setSelectedAction(actions[0] ?? null);
  }, [isControlled, controlledOnOpenChange, actions]);

  // Handle action selection (toggle block)
  const onSelect = useCallback(
    (type: string) => {
      if (!blockId) return;

      const block = Blocks.getBlock(editor, { id: blockId });
      if (!block) return;

      editor.toggleBlock(type, { preserveContent: true, focus: true, at: block.meta.order });
      close();
    },
    [editor, blockId, close],
  );

  // Context value
  const contextValue = useMemo(
    () => ({
      isOpen: isMounted,
      view,
      actions,
      selectedAction,
      setSelectedAction,
      onSelect,
      close,
      floatingStyles: combinedStyles,
      setFloatingRef: refs.setFloating,
    }),
    [isMounted, view, actions, selectedAction, onSelect, close, combinedStyles, refs.setFloating],
  );

  // API for render props
  const api: ActionMenuListApi = {
    actions,
    selectedAction,
    onSelect,
    empty: actions.length === 0,
  };

  // Render props or regular children
  const content = typeof children === 'function' ? children(api) : children;

  return (
    <ActionMenuListContext.Provider value={contextValue}>
      <div className={className}>{content}</div>
    </ActionMenuListContext.Provider>
  );
};

ActionMenuListRoot.displayName = 'ActionMenuList';

// ============================================================================
// ActionMenuList Content
// ============================================================================

type ActionMenuListContentProps = {
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const ActionMenuListContent = forwardRef<HTMLDivElement, ActionMenuListContentProps>(
  ({ children, className = '', ...props }, forwardedRef) => {
    const { isOpen, floatingStyles, setFloatingRef, actions, selectedAction, setSelectedAction, onSelect, view } =
      useActionMenuListContext();

    const mergedRef = useMergeRefs([forwardedRef, setFloatingRef]);

    if (!isOpen) return null;

    // Auto-generate items if no children provided
    const content =
      children ??
      (actions.length === 0 ? (
        <ActionMenuListEmpty />
      ) : (
        <ActionMenuListGroup>
          {actions.map((action) => (
            <ActionMenuListItem
              key={action.type}
              action={action}
              selected={action.type === selectedAction?.type}
              onMouseEnter={() => setSelectedAction(action)}
              onClick={() => onSelect(action.type)}
            />
          ))}
        </ActionMenuListGroup>
      ));

    return (
      <Portal id="yoopta-ui-action-menu-list-portal">
        <div
          ref={mergedRef}
          role="listbox"
          tabIndex={0}
          className={`yoopta-ui-action-menu-list-content yoopta-ui-action-menu-list-${view} ${className}`}
          style={floatingStyles}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {content}
        </div>
      </Portal>
    );
  },
);

ActionMenuListContent.displayName = 'ActionMenuList.Content';

// ============================================================================
// ActionMenuList Group
// ============================================================================

type ActionMenuListGroupProps = HTMLAttributes<HTMLDivElement>;

const ActionMenuListGroup = forwardRef<HTMLDivElement, ActionMenuListGroupProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`yoopta-ui-action-menu-list-group ${className}`} {...props}>
      {children}
    </div>
  ),
);

ActionMenuListGroup.displayName = 'ActionMenuList.Group';

// ============================================================================
// ActionMenuList Item
// ============================================================================

type ActionMenuListItemProps = HTMLAttributes<HTMLButtonElement> & {
  action: ActionMenuItem;
  selected?: boolean;
  icon?: string | ReactNode;
};

const ActionMenuListItem = forwardRef<HTMLButtonElement, ActionMenuListItemProps>(
  ({ action, selected, icon: iconProp, className = '', ...props }, ref) => {
    const renderIcon = (icon: unknown) => {
      if (!icon) return null;

      if (typeof icon === 'string') {
        return <img src={icon} alt="icon" />;
      }

      if (isValidElement(icon)) {
        return cloneElement(icon as React.ReactElement);
      }

      const IconComponent = icon as React.ComponentType;
      return <IconComponent />;
    };

    const iconToRender = iconProp ?? action.icon;

    return (
      <button
        ref={ref}
        type="button"
        className={`yoopta-ui-action-menu-list-item ${selected ? 'selected' : ''} ${className}`}
        data-action-menu-item-type={action.type}
        aria-selected={selected}
        aria-pressed={selected}
        {...props}
      >
        {iconToRender && <div className="yoopta-ui-action-menu-list-item-icon">{renderIcon(iconToRender)}</div>}
        <div className="yoopta-ui-action-menu-list-item-content">
          <div className="yoopta-ui-action-menu-list-item-title">{action.title}</div>
          {action.description && <div className="yoopta-ui-action-menu-list-item-description">{action.description}</div>}
        </div>
      </button>
    );
  },
);

ActionMenuListItem.displayName = 'ActionMenuList.Item';

// ============================================================================
// ActionMenuList Empty
// ============================================================================

type ActionMenuListEmptyProps = HTMLAttributes<HTMLDivElement>;

const ActionMenuListEmpty = forwardRef<HTMLDivElement, ActionMenuListEmptyProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`yoopta-ui-action-menu-list-empty ${className}`} {...props}>
      {children ?? 'No actions available'}
    </div>
  ),
);

ActionMenuListEmpty.displayName = 'ActionMenuList.Empty';

// ============================================================================
// Export
// ============================================================================

export const ActionMenuList = Object.assign(ActionMenuListRoot, {
  Root: ActionMenuListRoot,
  Content: ActionMenuListContent,
  Group: ActionMenuListGroup,
  Item: ActionMenuListItem,
  Empty: ActionMenuListEmpty,
});

export type {
  ActionMenuListRootProps,
  ActionMenuListContentProps,
  ActionMenuListGroupProps,
  ActionMenuListItemProps,
  ActionMenuListEmptyProps,
  ActionMenuListApi,
};
