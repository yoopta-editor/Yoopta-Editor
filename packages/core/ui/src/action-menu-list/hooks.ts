import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  autoUpdate,
  flip,
  offset,
  inline,
  shift,
  useFloating,
  useTransitionStyles,
} from '@floating-ui/react';
import { Blocks, HOTKEYS, findPluginBlockByPath, useYooptaEditor } from '@yoopta/editor';
import type { SlateElement } from '@yoopta/editor';
import type { NodeEntry } from 'slate';
import { Editor, Element, Path, Transforms } from 'slate';

import { useActionMenuListStore } from './store';
import { filterActionMenuItems, mapActionMenuItems } from './utils';
import type { ActionMenuItem, ActionMenuListProps } from './types';

const TRIGGER = '/';

/**
 * Lightweight hook for accessing only store actions
 * Use this when you only need to open/close the menu programmatically
 * without rendering the menu itself
 */
export const useActionMenuListActions = () => {
  const store = useActionMenuListStore();

  return {
    open: store.open,
    close: store.close,
    toggle: store.toggle,
    state: store.state,
  };
};

/**
 * Full hook with Floating UI, event listeners, and all logic
 * Use this only in the component that renders the ActionMenuList
 */
export const useActionMenuList = ({
  items,
  trigger = TRIGGER,
  view: viewProp = 'default',
}: ActionMenuListProps = {}) => {
  const editor = useYooptaEditor();
  const store = useActionMenuListStore();
  const {
    state,
    view,
    reference: storeReference,
    open: storeOpen,
    close: storeClose,
    setSearchText,
    setView,
    mode: storeMode,
    placement: storePlacement,
  } = store;

  console.log('storeMode', storeMode);
  console.log('storePlacement', storePlacement);

  const middleware = useMemo(() => {
    const baseMiddleware = [flip(), shift(), offset(10)];

    // Add inline() only for slash mode (text cursor positioning)
    if (storeMode === 'slash') {
      return [inline(), ...baseMiddleware];
    }

    return baseMiddleware;
  }, [storeMode]);

  const { refs, floatingStyles, context, update } = useFloating({
    placement: storePlacement,
    open: state === 'open',
    middleware: middleware,
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 100,
  });

  const blockTypes: ActionMenuItem[] = useMemo(
    () => mapActionMenuItems(editor, items || Object.keys(editor.blocks)),
    [editor, items],
  );

  const [selectedAction, setSelectedAction] = useState<ActionMenuItem>(blockTypes[0]);
  const [actions, setActions] = useState<ActionMenuItem[]>(blockTypes);

  const onClose = useCallback(() => {
    storeClose();
    setActions(blockTypes);
    setSelectedAction(blockTypes[0]);
    setView(viewProp);
  }, [store, blockTypes, viewProp]);

  // Sync store reference with Floating UI
  useEffect(() => {
    if (storeReference) {
      refs.setReference(storeReference);
    }
    if (state === 'open') {
      update();
    }
  }, [storeReference, state, refs, update]);

  const open = useCallback(
    ({ reference, view: viewMode, mode, placement } = {}) => {
      if (viewMode) setView(viewMode);

      storeOpen({ reference, view: viewMode, mode, placement });
    },
    [storeOpen, setView],
  );

  const onMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      const type = e.currentTarget.getAttribute('data-action-menu-item-type')!;
      const action = blockTypes.find((item) => item.type === type)!;
      setSelectedAction(action);
    },
    [blockTypes],
  );

  return {
    setFloatingRef: refs.setFloating,
    isMounted,
    state: state,
    // styles: { ...floatingStyles, ...transitionStyles },
    styles: floatingStyles,
    actions,
    selectedAction,
    empty: actions.length === 0,
    view,
    open,
    onClose,
    onMouseEnter,
    getItemProps: (type: string) => ({
      onMouseEnter,
      'data-action-menu-item': true,
      'data-action-menu-item-type': type,
      'aria-selected': type === selectedAction?.type,
      onClick: () => {
        // editor.toggleBlock(type, { deleteText: mode === 'create', focus: true });
        editor.toggleBlock(type, { deleteText: false, focus: true });
        onClose();
      },
    }),
    getRootProps: () => ({
      'data-action-menu-list': true,
    }),
  };
};
