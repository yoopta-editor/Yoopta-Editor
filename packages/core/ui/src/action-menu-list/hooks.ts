import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  useTransitionStyles,
} from '@floating-ui/react';
import { Blocks, HOTKEYS, findPluginBlockByPath, useYooptaEditor } from '@yoopta/editor';
import type { SlateElement } from '@yoopta/editor';
import type { NodeEntry } from 'slate';
import { Editor, Element, Path, Transforms } from 'slate';

import { useActionMenuListStore } from './store';
import { filterActionMenuItems, isSlashPressed, mapActionMenuItems } from './utils';
import type { ActionMenuItem, ActionMenuListProps } from './types';

const TRIGGER = '/';

export const useActionMenuList = ({
  items,
  trigger = TRIGGER,
  view: viewProp = 'default',
  mode = 'create',
}: ActionMenuListProps = {}) => {
  const editor = useYooptaEditor();
  const store = useActionMenuListStore();

  const [view, setView] = useState<'small' | 'default'>(viewProp);

  const { refs, floatingStyles, context, update } = useFloating({
    placement: 'bottom-start',
    open: store.state === 'open',
    middleware: [flip(), shift(), offset(10)],
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

  const onFilter = useCallback(
    ({ text }: { text: string }) => {
      const searchText = text.trim().replace(trigger, '');

      if (!searchText) {
        setActions(blockTypes);
        store.setSearchText('');
        return;
      }

      const filteredActions = blockTypes.filter((action) =>
        filterActionMenuItems(editor.blocks[action.type], searchText),
      );

      if (filteredActions.length > 0) {
        const currentExists = filteredActions.some((item) => item.type === selectedAction?.type);

        if (!currentExists) {
          setSelectedAction(filteredActions[0]);
        }
      }

      setActions(filteredActions);
      store.setSearchText(searchText);
    },
    [blockTypes, editor.blocks, selectedAction, store, trigger],
  );

  const onClose = useCallback(() => {
    store.close();
    setActions(blockTypes);
    setSelectedAction(blockTypes[0]);
    setView(viewProp);
  }, [store, blockTypes, viewProp]);

  const onOpen = useCallback(
    ({ reference, view: viewMode } = {}) => {
      if (reference) {
        console.log('reference.getBoundingClientRect()', reference.getBoundingClientRect());
        console.log('reference.getClientRects()', reference.getClientRects());
        refs.setReference(reference);
      }

      if (viewMode) {
        setView(viewMode);
      }

      store.open();
    },
    [store, refs],
  );

  useEffect(() => {
    // update();

    const handleActionMenuKeyUp = (event: KeyboardEvent) => {
      const slate = Blocks.getBlockSlate(editor, { at: editor.path.current });
      const isInsideEditor = editor.refElement?.contains(event.target as Node);

      if (!slate || !slate.selection || !isInsideEditor) return;

      const parentPath = Path.parent(slate.selection.anchor.path);
      const string = Editor.string(slate, parentPath);

      if (string.length === 0 || store.state !== 'open') return onClose();
      onFilter({ text: string });
    };

    const handleActionMenuKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) return;

      const slate = Blocks.getBlockSlate(editor, { at: editor.path.current });
      const slateEditorRef = event.currentTarget as HTMLElement;

      const isInsideEditor = slateEditorRef?.contains(event.target as Node);

      const pluginWithCustomEditor = document.querySelector('[data-custom-editor]');
      const isInsideCustomEditor = pluginWithCustomEditor?.contains(event.target as Node);

      if (isInsideCustomEditor || !slate || !slate.selection || !isInsideEditor) return;

      const isSlashKey = isSlashPressed(event);

      if (isSlashKey || HOTKEYS.isSlashCommand(event)) {
        const isInTypingMode = slate.selection && !Editor.isEditor(slate.selection.anchor.path[0]);
        if (!isInTypingMode) return;

        const parentPath = Path.parent(slate.selection.anchor.path);
        const string = Editor.string(slate, parentPath);
        const isStart = Editor.isStart(slate, slate.selection.anchor, slate.selection.focus);

        if (!isStart || string.trim().length > 0) return;

        const domSelection = window.getSelection();
        if (!domSelection) return;

        const domRange = domSelection.getRangeAt(0);
        const selectionRect = domRange.getBoundingClientRect();

        if (domRange) {
          // refs.setReference({
          //   getBoundingClientRect: () => selectionRect,
          //   getClientRects: () => domRange.getClientRects(),
          // });
          const reference = {
            getBoundingClientRect: () => selectionRect,
            getClientRects: () => domRange.getClientRects(),
          };
          onOpen({ reference: reference as HTMLElement });
        }
      }

      if (store.state !== 'open') return;

      if (HOTKEYS.isTab(event)) {
        event.preventDefault();
        return;
      }

      if (HOTKEYS.isArrowUp(event)) {
        event.preventDefault();
        const currentSelected = selectedAction || actions[0];
        if (!currentSelected) return;

        const menuList = document.querySelector('[data-action-menu-list]');
        const menuListItems = menuList?.querySelectorAll('[data-action-menu-item]');
        if (!menuListItems) return;

        const currentListItem = menuList?.querySelector(`[aria-selected="true"]`) as HTMLElement;
        const currentIndex = Array.from(menuListItems || []).indexOf(currentListItem);

        const prevIndex = currentIndex - 1;
        const prevEl = menuListItems[prevIndex];

        if (!prevEl) {
          const lastEl = menuListItems[menuListItems.length - 1];
          const lastActionType = lastEl.getAttribute('data-action-menu-item-type');
          lastEl.scrollIntoView({ block: 'nearest' });

          const lastAction = actions.find((item) => item.type === lastActionType)!;
          return setSelectedAction(lastAction);
        }

        prevEl.scrollIntoView({ block: 'nearest' });
        const prevActionType = prevEl.getAttribute('data-action-menu-item-type');

        const lastAction = actions.find((item) => item.type === prevActionType)!;
        return setSelectedAction(lastAction);
      }

      if (HOTKEYS.isArrowDown(event)) {
        event.preventDefault();
        const currentSelected = selectedAction || actions[0];
        if (!currentSelected) return;

        const menuList = document.querySelector('[data-action-menu-list]');
        const menuListItems = menuList?.querySelectorAll('[data-action-menu-item]');
        if (!menuListItems) return;

        const currentListItem = menuList?.querySelector(`[aria-selected="true"]`) as HTMLElement;
        const currentIndex = Array.from(menuListItems || []).indexOf(currentListItem);

        const nextIndex = currentIndex + 1;
        const nextEl = menuListItems[nextIndex];

        if (!nextEl) {
          const firstEl = menuListItems[0];
          const firstActionType = firstEl.getAttribute('data-action-menu-item-type');
          firstEl.scrollIntoView({ block: 'nearest' });
          const firstAction = actions.find((item) => item.type === firstActionType)!;

          return setSelectedAction(firstAction);
        }

        nextEl.scrollIntoView({ block: 'nearest' });
        const nextActionType = nextEl.getAttribute('data-action-menu-item-type');

        const nextAction = actions.find((item) => item.type === nextActionType)!;
        return setSelectedAction(nextAction);
      }

      if (HOTKEYS.isArrowLeft(event)) {
        event.preventDefault();
        return;
      }

      if (HOTKEYS.isArrowRight(event)) {
        event.preventDefault();
        return;
      }

      if (HOTKEYS.isBackspace(event)) {
        if (!slate.selection) return;
        const isStart = Editor.isStart(slate, slate.selection.anchor, slate.selection.focus);
        if (isStart) return onClose();
      }

      if (HOTKEYS.isEscape(event)) {
        event.preventDefault();
        onClose();
        return;
      }

      if (HOTKEYS.isEnter(event)) {
        event.preventDefault();

        const selected = document.querySelector(
          '[data-action-menu-item][aria-selected=true]',
        ) as HTMLElement;
        const type = selected?.dataset.actionMenuItemType;
        if (!type) return;

        const blockEntry: NodeEntry<SlateElement<string>> | undefined = Editor.above(slate, {
          match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
          mode: 'lowest',
        });

        if (blockEntry) {
          const [, currentNodePath] = blockEntry;
          const path = blockEntry ? currentNodePath : [];

          const start = Editor.start(slate, path);
          const range = { anchor: slate.selection.anchor, focus: start };

          Transforms.select(slate, range);
          Transforms.delete(slate);
        }

        editor.toggleBlock(type, { deleteText: true, focus: true });
        return onClose();
      }
    };

    if (store.state === 'open') {
      document.addEventListener('click', onClose);
    }

    if (typeof editor.path.current === 'number') {
      const block = findPluginBlockByPath(editor, { at: editor.path.current });
      if (!block) return;

      const slateEditorRef = editor.refElement?.querySelector(
        `[data-yoopta-block-id="${block.id}"] [data-slate-editor="true"]`,
      ) as HTMLElement;

      if (!slateEditorRef) return;

      slateEditorRef.addEventListener('keydown', handleActionMenuKeyDown);
      slateEditorRef.addEventListener('keyup', handleActionMenuKeyUp);
      return () => {
        slateEditorRef.removeEventListener('keydown', handleActionMenuKeyDown);
        slateEditorRef.removeEventListener('keyup', handleActionMenuKeyUp);
        document.removeEventListener('click', onClose);
      };
    }
  }, [actions, store.state, editor.path, onClose, onOpen, onFilter, refs, editor, selectedAction]);

  // Auto-close when no results after 3 seconds
  useEffect(() => {
    const empty = actions.length === 0;
    if (!empty) return;

    const timeout = setTimeout(() => {
      if (empty) onClose();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [actions.length, store.state, onClose]);

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
    state: store.state,
    styles: { ...floatingStyles, ...transitionStyles },
    actions,
    selectedAction,
    empty: actions.length === 0,
    view,
    mode,
    open: onOpen,
    onClose,
    onMouseEnter,
    getItemProps: (type: string) => ({
      onMouseEnter,
      'data-action-menu-item': true,
      'data-action-menu-item-type': type,
      'aria-selected': type === selectedAction?.type,
      onClick: () => {
        editor.toggleBlock(type, { deleteText: mode === 'create', focus: true });
        onClose();
      },
    }),
    getRootProps: () => ({
      'data-action-menu-list': true,
    }),
  };
};
