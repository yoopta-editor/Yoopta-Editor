import type { MouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Placement } from '@floating-ui/react';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  useTransitionStyles,
} from '@floating-ui/react';
import { Blocks, useYooptaEditor } from '@yoopta/editor';

import { useActionMenuListStore } from './store';
import type { ActionMenuItem, ActionMenuListProps } from './types';
import { filterToggleActions, mapActionMenuItems } from './utils';

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
    isOpen: store.state === 'open',
  };
};

/**
 * Full hook with Floating UI and all logic
 * Use this only in the component that renders the ActionMenuList
 */
export const useActionMenuList = ({ view: viewProp = 'default' }: ActionMenuListProps = {}) => {
  const editor = useYooptaEditor();
  const store = useActionMenuListStore();
  const {
    state,
    view,
    reference: storeReference,
    blockId: storeBlockId,
    open: storeOpen,
    close: storeClose,
    setView,
    placement: storePlacement,
  } = store;

  const { refs, floatingStyles, context, update } = useFloating({
    placement: storePlacement,
    open: state === 'open',
    middleware: [flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 100,
  });

  const blockTypes: ActionMenuItem[] = useMemo(
    () => mapActionMenuItems(editor).filter((item) => filterToggleActions(editor, item.type)),
    [editor],
  );

  const [selectedAction, setSelectedAction] = useState<ActionMenuItem>(blockTypes[0]);
  const [actions, setActions] = useState<ActionMenuItem[]>(blockTypes);

  const close = useCallback(() => {
    storeClose();
    setActions(blockTypes);
    setSelectedAction(blockTypes[0]);
    setView(viewProp);
  }, [storeClose, blockTypes, viewProp, setView]);

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
    (options: {
      reference: HTMLElement | null;
      blockId?: string;
      placement?: Placement;
      view?: 'small' | 'default';
    }) => {
      const { reference, view: viewMode, placement, blockId } = options;
      if (viewMode) setView(viewMode);

      storeOpen({ reference, view: viewMode, placement, blockId });
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

  const getItemProps = useCallback(
    (type: string) => ({
      onMouseEnter,
      onMouseDown: (e: MouseEvent) => e.stopPropagation(),
      onClick: (e: MouseEvent) => {
        if (!storeBlockId) return;
        const block = Blocks.getBlock(editor, { id: storeBlockId });
        if (!block) return;

        e.stopPropagation();
        editor.toggleBlock(type, { preserveContent: true, focus: true, at: block.meta.order });
        close();
      },
      'data-action-menu-item': true,
      'data-action-menu-item-type': type,
      'aria-selected': type === selectedAction?.type,
    }),
    [onMouseEnter, selectedAction, editor, close],
  );

  const getRootProps = useCallback(
    () => ({
      'data-action-menu-list': true,
      ref: refs.setFloating,
      style: { ...floatingStyles, ...transitionStyles, minWidth: view === 'small' ? 200 : 244 },
      onMouseDown: (e: MouseEvent) => e.stopPropagation(),
      onClick: (e: MouseEvent) => e.stopPropagation(),
    }),
    [refs.setFloating, floatingStyles, transitionStyles, view],
  );

  return {
    isOpen: isMounted,
    state,
    actions,
    selectedAction,
    empty: actions.length === 0,
    view,
    open,
    close,
    getItemProps,
    getRootProps,
  };
};
