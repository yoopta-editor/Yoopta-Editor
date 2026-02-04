import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cloneElement, forwardRef, isValidElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Placement } from '@floating-ui/react';
import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
} from '@floating-ui/react';
import { getRootBlockElement, useYooptaEditor } from '@yoopta/editor';

import { ActionMenuListContext, useActionMenuListContext } from './context';
import type { ActionMenuItem } from './types';
import { filterToggleActions, mapActionMenuItems } from './utils';
import { Overlay } from '../overlay';
import './action-menu-list.css';

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
  /** View mode - 'small' for compact, 'default' for full */
  view?: 'small' | 'default';
  /** Placement relative to anchor */
  placement?: Placement;
  className?: string;
};

const ActionMenuListRoot = ({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  anchor = null,
  view = 'default',
  placement = 'bottom-start',
  className = '',
}: ActionMenuListRootProps) => {
  const editor = useYooptaEditor();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const actions = useMemo(() => {
    const baseActions = mapActionMenuItems(editor)
      .filter((item) => filterToggleActions(editor, item.type))
      .filter((item) => {
        const plugin = editor.plugins[item.type];
        const rootElement = getRootBlockElement(plugin.elements);
        return (
          rootElement?.props?.nodeType !== 'inline' &&
          rootElement?.props?.nodeType !== 'inlineVoid' &&
          rootElement?.props?.nodeType !== 'void'
        );
      });

    return baseActions;
  }, [editor]);

  const [selectedAction, setSelectedAction] = useState<ActionMenuItem | null>(actions[0] ?? null);

  const onOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      controlledOnOpenChange?.(newOpen);
    },
    [isControlled, controlledOnOpenChange],
  );

  const { refs, floatingStyles, context } = useFloating({
    elements: { reference: anchor },
    placement,
    open: isOpen,
    onOpenChange,
    middleware: [flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  if (isOpen) {
    console.log('ActionMenuListRoot refs', refs)
  }


  // Handle dismiss (escape key, outside press handled by Overlay)
  const dismiss = useDismiss(context, {
    escapeKey: true,
    outsidePress: false, // Overlay handles this
  });

  const { getFloatingProps } = useInteractions([dismiss]);

  const combinedStyles: CSSProperties = useMemo(
    () => ({
      ...floatingStyles,
      minWidth: view === 'small' ? 200 : 244,
    }),
    [floatingStyles, view],
  );

  const close = useCallback(() => {
    onOpenChange(false);
    setSelectedAction(actions[0] ?? null);
  }, [onOpenChange, actions]);

  const onSelect = useCallback(
    (type: string) => {
      if (Array.isArray(editor.path.selected) && editor.path.selected.length > 0) {
        editor.batchOperations(() => {
          editor.path.selected!.forEach((selected) => {
            editor.toggleBlock(type, { preserveContent: true, focus: true, at: selected });
          });
        });
      } else {
        editor.toggleBlock(type, { preserveContent: true, focus: true, at: editor.path.current });
      }

      close();
    },
    [editor, close],
  );

  // Context value
  const contextValue = useMemo(
    () => ({
      isOpen,
      view,
      actions,
      selectedAction,
      setSelectedAction,
      onSelect,
      close,
      floatingStyles: combinedStyles,
      setFloatingRef: refs.setFloating,
      getFloatingProps,
    }),
    [isOpen, view, actions, selectedAction, onSelect, close, combinedStyles, refs.setFloating, getFloatingProps],
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

type ActionMenuListContentProps = {
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const ActionMenuListContent = forwardRef<HTMLDivElement, ActionMenuListContentProps>(
  ({ children, className = '', ...props }, forwardedRef) => {
    const {
      isOpen,
      floatingStyles,
      setFloatingRef,
      actions,
      selectedAction,
      setSelectedAction,
      onSelect,
      view,
      close,
      getFloatingProps,
    } = useActionMenuListContext();
    const internalRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs([forwardedRef, setFloatingRef, internalRef]);
    const editor = useYooptaEditor();

    // Auto-focus content when it opens for proper escape key handling
    useEffect(() => {
      let raf;

      if (isOpen && internalRef.current) {
        // Use requestAnimationFrame to ensure DOM is ready
        raf = requestAnimationFrame(() => {
          internalRef.current?.focus();
        });
      }

      return () => cancelAnimationFrame(raf);
    }, [isOpen]);

    if (!isOpen) return null;

    // Auto-generate items if no children provided
    const content =
      children ??
      (actions.length === 0 ? (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <ActionMenuListEmpty />
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <ActionMenuListGroup>
          {actions.map((action) => (
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
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
      <FloatingPortal root={editor.refElement} id={`yoopta-ui-action-menu-list-portal-${editor.id}`}>
        <Overlay lockScroll={false} onClick={close} className="yoopta-ui-action-menu-list-overlay">
          <div
            ref={mergedRef}
            role="listbox"
            tabIndex={0}
            className={`yoopta-ui-action-menu-list-content yoopta-ui-action-menu-list-${view} ${className}`}
            style={floatingStyles}
            {...getFloatingProps({
              onMouseDown: (e) => {
                e.preventDefault();
                e.stopPropagation();
              },
              onClick: (e) => e.stopPropagation(),
            })}
            {...props}
          >
            {content}
          </div>
        </Overlay>
      </FloatingPortal>
    );
  },
);

ActionMenuListContent.displayName = 'ActionMenuList.Content';

type ActionMenuListGroupProps = HTMLAttributes<HTMLDivElement>;

const ActionMenuListGroup = forwardRef<HTMLDivElement, ActionMenuListGroupProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`yoopta-ui-action-menu-list-group ${className}`} {...props}>
      {children}
    </div>
  ),
);

ActionMenuListGroup.displayName = 'ActionMenuList.Group';

type ActionMenuListItemProps = HTMLAttributes<HTMLButtonElement> & {
  action?: ActionMenuItem;
  selected?: boolean;
  icon?: string | ReactNode;
};

const ActionMenuListItem = forwardRef<HTMLButtonElement, ActionMenuListItemProps>(
  ({ action, selected, icon: iconProp, className = '', children, ...props }, ref) => {
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

    const iconToRender = iconProp ?? action?.icon;

    return (
      <button
        ref={ref}
        type="button"
        className={`yoopta-ui-action-menu-list-item ${selected ? 'selected' : ''} ${className}`}
        data-action-menu-item-type={action?.type}
        data-selected={selected}
        aria-pressed={selected}
        {...props}
      >
        {action && (
          <>
            {iconToRender && <div className="yoopta-ui-action-menu-list-item-icon">{renderIcon(iconToRender)}</div>}
            <div className="yoopta-ui-action-menu-list-item-content">
              <div className="yoopta-ui-action-menu-list-item-title">{action?.title}</div>
              {action?.description && <div className="yoopta-ui-action-menu-list-item-description">{action?.description}</div>}
            </div>
          </>
        )}
        {children}
      </button>
    );
  },
);

ActionMenuListItem.displayName = 'ActionMenuList.Item';

type ActionMenuListEmptyProps = HTMLAttributes<HTMLDivElement>;

const ActionMenuListEmpty = forwardRef<HTMLDivElement, ActionMenuListEmptyProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`yoopta-ui-action-menu-list-empty ${className}`} {...props}>
      {children ?? 'No actions available'}
    </div>
  ),
);

ActionMenuListEmpty.displayName = 'ActionMenuList.Empty';

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
