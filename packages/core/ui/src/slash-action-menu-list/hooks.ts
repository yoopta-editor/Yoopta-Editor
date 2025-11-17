import {
  autoUpdate,
  flip,
  offset,
  shift,
  inline,
  useFloating,
  useTransitionStyles,
} from '@floating-ui/react';
import {
  Blocks,
  HOTKEYS,
  SlateElement,
  useYooptaEditor,
  findPluginBlockByPath,
} from '@yoopta/editor';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Editor, Element, NodeEntry, Path, Transforms } from 'slate';
import { ActionMenuItem } from '../action-menu-list/types';
import {
  filterActionMenuItems,
  isSlashPressed,
  mapActionMenuItems,
} from '../action-menu-list/utils';
import { useSlashActionMenuStore } from './store';

type SlashActionMenuProps = {
  trigger?: string;
};

const TRIGGER = '/';

/**
 * Lightweight hook for accessing only store actions
 * Use this when you only need to open/close the menu programmatically
 * without rendering the menu itself
 */
export const useSlashActionMenuActions = () => {
  const store = useSlashActionMenuStore();

  return {
    open: store.open,
    close: store.close,
    isOpen: store.state === 'open',
  };
};

/**
 * Full hook with Floating UI, event listeners, and all logic
 * Use this only in the component that renders the SlashActionMenu
 */
export const useSlashActionMenu = ({ trigger = TRIGGER }: SlashActionMenuProps = {}) => {
  const editor = useYooptaEditor();
  const store = useSlashActionMenuStore();
  const {
    state,
    reference: storeReference,
    searchText: storeSearchText,
    selectedIndex,
    open: storeOpen,
    close: storeClose,
    setSearchText,
    setSelectedIndex,
  } = store;

  const [actions, setActions] = useState<ActionMenuItem[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionMenuItem | null>(null);

  const { refs, floatingStyles, context, update } = useFloating({
    placement: 'bottom-start',
    open: state === 'open',
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 100,
  });

  const blockTypes: ActionMenuItem[] = useMemo(
    () => mapActionMenuItems(editor, Object.keys(editor.blocks)),
    [editor],
  );

  const reset = () => {
    setActions(blockTypes);
    setSelectedAction(blockTypes[0]);
    setSearchText('');
  };

  // Update reference when it changes
  useEffect(() => {
    if (storeReference) {
      reset();
      refs.setReference(storeReference);
    }
  }, [storeReference, refs]);

  // Update position when menu opens
  useEffect(() => {
    if (state === 'open') {
      update();
    }
  }, [state, update]);

  const onClose = useCallback(() => {
    reset();
    storeClose();
  }, [storeClose, blockTypes, setSearchText]);

  const open = (reference?: HTMLElement | null) => {
    reset();
    storeOpen(reference);
  };

  // Auto-close when no results after 3 seconds
  useEffect(() => {
    const empty = actions.length === 0;
    if (!empty) return;

    const timeout = setTimeout(() => {
      if (empty) onClose();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [actions.length, state, onClose]);

  const onFilter = useCallback(
    ({ text }: { text: string }) => {
      const searchText = text.trim().replace(trigger, '');

      if (searchText.length === 0) {
        setActions(blockTypes);
        setSearchText('');
        return;
      }

      const filteredActions = blockTypes.filter((action) =>
        filterActionMenuItems(editor.blocks[action.type], searchText),
      );

      if (filteredActions.length > 0) {
        const currentExists = filteredActions.some((item) => item.type === selectedAction?.type);

        if (!currentExists) {
          setSelectedAction(filteredActions[0]);
          setSelectedIndex(0);
        }
      }

      setActions(filteredActions);
      setSearchText(searchText);
    },
    [trigger, blockTypes, editor.blocks, selectedAction, setSearchText, setSelectedIndex],
  );

  useEffect(() => {
    // update();

    const handleActionMenuKeyUp = (event: KeyboardEvent) => {
      const slate = Blocks.getBlockSlate(editor, { at: editor.path.current });
      const isInsideEditor = editor.refElement?.contains(event.target as Node);

      if (!slate || !slate.selection || !isInsideEditor) return;

      const parentPath = Path.parent(slate.selection.anchor.path);
      const string = Editor.string(slate, parentPath);

      if (string.length === 0 || state !== 'open') return onClose();
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

        if (domRange) {
          const reference = {
            getBoundingClientRect: () => domRange.getBoundingClientRect(),
            getClientRects: () => domRange.getClientRects(),
          };

          open(reference as HTMLElement);
        }
      }

      if (state !== 'open') return;

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

    if (state === 'open') {
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
  }, [actions, state, editor.path, onClose, open, onFilter, refs, editor, selectedAction]);

  const getItemProps = useCallback(
    (type: string) => ({
      'data-action-menu-item': true,
      'data-action-menu-item-type': type,
      'aria-selected': type === selectedAction?.type,
      onClick: (e: MouseEvent) => {
        e.stopPropagation();

        editor.toggleBlock(type, { deleteText: true, focus: true });
        onClose();
      },
      onMouseDown: (e: MouseEvent) => {
        e.stopPropagation();
      },
      onMouseEnter: () => {
        const action = actions.find((item) => item.type === type);
        if (action) {
          setSelectedAction(action);
          const index = actions.indexOf(action);
          setSelectedIndex(index);
        }
      },
    }),
    [editor, actions, selectedAction, onClose, setSelectedIndex],
  );

  const getRootProps = useCallback(
    () => ({
      'data-action-menu-list': true,
      ref: refs.setFloating,
      style: { ...floatingStyles, ...transitionStyles, minWidth: 244 },
    }),
    [refs.setFloating, floatingStyles, transitionStyles],
  );

  return {
    isOpen: isMounted,
    state,
    actions,
    selectedAction,
    empty: actions.length === 0,
    searchText: storeSearchText,
    open,
    close: storeClose,
    getItemProps,
    getRootProps,
  };
};
