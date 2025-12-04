import type { MouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  autoUpdate,
  flip,
  inline,
  offset,
  shift,
  useFloating,
  useTransitionStyles,
} from '@floating-ui/react';
import {
  Blocks,
  Elements,
  HOTKEYS,
  type SlateElement,
  getAllowedPluginsFromElement,
  useYooptaEditor,
} from '@yoopta/editor';
import type { NodeEntry } from 'slate';
import { Editor, Element, Path, Transforms } from 'slate';

import { useSlashActionMenuStore } from './store';
import { useArrowNavigation } from './useArrowNavigation';
import type { ActionMenuItem } from '../action-menu-list/types';
import {
  filterActionMenuItems,
  isSlashPressed,
  mapActionMenuItems,
} from '../action-menu-list/utils';

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
    open: storeOpen,
    close: storeClose,
    setSearchText,
    setSelectedIndex,
  } = store;

  const [actions, setActions] = useState<ActionMenuItem[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionMenuItem | null>(null);

  const { handleArrowUp, handleArrowDown, handleArrowLeft, handleArrowRight } = useArrowNavigation({
    actions,
    selectedAction,
    setSelectedAction,
  });

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
    () => mapActionMenuItems(editor),
    [editor.path, editor.plugins],
  );

  const reset = useCallback(() => {
    setActions(blockTypes);
    setSelectedAction(blockTypes[0]);
    setSearchText('');
  }, [setSearchText]);

  // Update reference when it changes
  useEffect(() => {
    if (storeReference) {
      reset();
      refs.setReference(storeReference);
    }
  }, [storeReference, refs, reset]);

  // Update position when menu opens
  useEffect(() => {
    if (state === 'open') {
      update();
    }
  }, [state, update]);

  const onClose = useCallback(() => {
    reset();
    storeClose();
  }, [reset, storeClose]);

  const open = useCallback(
    (reference?: HTMLElement | null) => {
      reset();
      storeOpen(reference);
    },
    [reset, storeOpen],
  );

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
        filterActionMenuItems(editor.plugins[action.type], searchText),
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
    [trigger, blockTypes, selectedAction, setSearchText, setSelectedIndex, editor.plugins],
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
        return handleArrowUp(event);
      }

      if (HOTKEYS.isArrowDown(event)) {
        return handleArrowDown(event);
      }

      if (HOTKEYS.isArrowLeft(event)) {
        return handleArrowLeft(event);
      }

      if (HOTKEYS.isArrowRight(event)) {
        return handleArrowRight(event);
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
        const toType = selected?.dataset.actionMenuItemType;
        if (!toType) return;

        // Check if we're inside an element with allowedPlugins
        const block = Blocks.getBlock(editor, { at: editor.path.current });
        if (!block) return onClose();

        const allowedPlugins = getAllowedPluginsFromElement(editor, slate);

        // If we're in an element with allowedPlugins and the selected type is allowed
        if (allowedPlugins && allowedPlugins.includes(toType)) {
          const selectedPlugin = editor.plugins[toType];
          if (!selectedPlugin) return onClose();

          // Get the root element type of the selected plugin
          const rootElementType =
            Object.keys(selectedPlugin.elements).find(
              (key) => selectedPlugin.elements[key].asRoot,
            ) || Object.keys(selectedPlugin.elements)[0];

          if (!rootElementType) return onClose();

          const rootElement = selectedPlugin.elements[rootElementType];

          // Delete the slash command text
          const blockElementEntry: NodeEntry<SlateElement> | undefined = Editor.above(slate, {
            match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
            mode: 'lowest',
          });

          if (blockElementEntry) {
            const [, currentNodePath] = blockElementEntry;
            const start = Editor.start(slate, currentNodePath);
            const range = { anchor: slate.selection.anchor, focus: start };

            Transforms.select(slate, range);
            Transforms.delete(slate);
          }

          // Create the element inside the current element with allowedPlugins
          Elements.createElement(
            editor,
            block.id,
            {
              type: rootElementType,
              props: rootElement.props,
            },
            {
              path: 'next',
              focus: true,
            },
          );

          return onClose();
        }

        // Default behavior: transform the current block
        const blockElementEntry: NodeEntry<SlateElement> | undefined = Editor.above(slate, {
          match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
          mode: 'lowest',
        });

        if (blockElementEntry) {
          const [, currentNodePath] = blockElementEntry;
          const path = blockElementEntry ? currentNodePath : [];

          const start = Editor.start(slate, path);
          const range = { anchor: slate.selection.anchor, focus: start };

          Transforms.select(slate, range);
          Transforms.delete(slate);
        }

        editor.toggleBlock(toType, { scope: 'auto', focus: true, preserveContent: false });
        return onClose();
      }
    };

    if (state === 'open') {
      document.addEventListener('click', onClose);
    }

    if (typeof editor.path.current === 'number') {
      const block = Blocks.getBlock(editor, { at: editor.path.current });
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
  }, [
    actions,
    state,
    editor.path,
    onClose,
    open,
    onFilter,
    refs,
    editor,
    selectedAction,
    handleArrowUp,
    handleArrowDown,
    handleArrowLeft,
    handleArrowRight,
  ]);

  const getItemProps = useCallback(
    (type: string) => ({
      'data-action-menu-item': true,
      'data-action-menu-item-type': type,
      'aria-selected': type === selectedAction?.type,
      onClick: (e: MouseEvent) => {
        e.stopPropagation();

        editor.toggleBlock(type, { scope: 'auto', focus: true, preserveContent: false });
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
