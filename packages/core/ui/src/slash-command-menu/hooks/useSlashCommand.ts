import { useCallback, useEffect, useReducer } from 'react';
import type { VirtualElement } from '@floating-ui/dom';
import type { FloatingContext } from '@floating-ui/react';
import { useTransitionStyles } from '@floating-ui/react';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { Editor, Path } from 'slate';

import { KEYS, SLASH_TRIGGER } from '../constants';
import type { SlashCommandItem, SlashCommandState } from '../types';
import { useFilter } from './useFilter';
import { getVirtualElementRects, usePositioning } from './usePositioning';

type Action =
  | {
      type: 'OPEN';
      virtualElement: VirtualElement;
      floatingContext: FloatingContext<VirtualElement> | null;
    }
  | { type: 'CLOSE' }
  | { type: 'SET_SEARCH'; search: string }
  | { type: 'SET_SELECTED_INDEX'; index: number }
  | { type: 'RESET_SELECTION' };

const initialState: SlashCommandState = {
  isOpen: false,
  search: '',
  selectedIndex: 0,
  virtualElement: null,
  floatingContext: null,
};

function reducer(state: SlashCommandState, action: Action): SlashCommandState {
  switch (action.type) {
    case 'OPEN':
      return {
        ...state,
        isOpen: true,
        search: '',
        selectedIndex: 0,
        virtualElement: action.virtualElement,
        floatingContext: action.floatingContext,
      };

    case 'CLOSE':
      return {
        ...state,
        isOpen: false,
        search: '',
        selectedIndex: 0,
        virtualElement: null,
        floatingContext: null,
      };

    case 'SET_SEARCH':
      return {
        ...state,
        search: action.search,
        selectedIndex: 0,
      };

    case 'SET_SELECTED_INDEX': {
      return {
        ...state,
        selectedIndex: action.index,
      };
    }

    case 'RESET_SELECTION':
      return {
        ...state,
        selectedIndex: 0,
      };

    default:
      return state;
  }
}

// ============================================================================
// UTILITY: Check if slash pressed
// ============================================================================

function isSlashKey(event: KeyboardEvent): boolean {
  return event.key === '/' || event.key === SLASH_TRIGGER;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

type UseSlashCommandOptions = {
  items: SlashCommandItem[];
  trigger?: string;
  onSelect?: (item: SlashCommandItem) => void;
};

export function useSlashCommand({
  items,
  trigger = SLASH_TRIGGER,
  onSelect,
}: UseSlashCommandOptions) {
  const editor = useYooptaEditor();
  const [state, dispatch] = useReducer(reducer, initialState);

  const { filteredItems, groupedItems, isEmpty } = useFilter({
    items,
    search: state.search,
  });

  const { refs, floatingStyles, floatingContext } = usePositioning({
    isOpen: state.isOpen,
    virtualElement: state.virtualElement,
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(floatingContext, {
    duration: 100,
  });

  const open = useCallback((el: VirtualElement, ctx: FloatingContext<VirtualElement>) => {
    dispatch({ type: 'OPEN', virtualElement: el, floatingContext: ctx });
  }, []);

  const close = useCallback(() => {
    dispatch({ type: 'CLOSE' });
  }, []);

  const setSearch = useCallback((search: string) => {
    dispatch({ type: 'SET_SEARCH', search });
  }, []);

  const setSelectedIndex = (index: number) => {
    dispatch({ type: 'SET_SELECTED_INDEX', index });
  };

  const executeSelected = () => {
    const selectedItem = filteredItems[state.selectedIndex];
    if (!selectedItem) return;

    // Execute custom onSelect if provided on item
    if (selectedItem.onSelect) {
      selectedItem.onSelect();
    }

    // Execute global onSelect callback
    if (onSelect) {
      onSelect(selectedItem);
    } else {
      editor.toggleBlock(selectedItem.id, {
        scope: 'auto',
        focus: true,
        preserveContent: false,
      });
    }

    close();
  };

  useEffect(() => {
    if (typeof editor.path.current !== 'number') return;

    const block = Blocks.getBlock(editor, { at: editor.path.current });
    if (!block) return;

    const slateEl = editor.refElement?.querySelector(
      `[data-yoopta-block-id="${block.id}"] [data-slate-editor="true"]`,
    ) as HTMLElement | null;

    if (!slateEl) return;

    // Handle keydown for slash trigger
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) return;

      const slate = Blocks.getBlockSlate(editor, { at: editor.path.current });
      if (!slate?.selection) return;

      const isInsideEditor = slateEl.contains(event.target as Node);
      if (!isInsideEditor) return;

      // Trigger on slash
      if (isSlashKey(event)) {
        const parentPath = Path.parent(slate.selection.anchor.path);
        const text = Editor.string(slate, parentPath);
        const isStart = Editor.isStart(slate, slate.selection.anchor, slate.selection.focus);

        // Only trigger on empty line at start
        if (isStart && text.trim().length === 0) {
          const virtualElement = getVirtualElementRects();
          if (virtualElement) open(virtualElement, floatingContext);
        }
      }

      if (event.key === KEYS.ARROW_DOWN) {
        event.preventDefault();
        event.stopPropagation();
        setSelectedIndex(
          state.selectedIndex === filteredItems.length - 1 ? 0 : state.selectedIndex + 1,
        );
      } else if (event.key === KEYS.ARROW_UP) {
        event.preventDefault();
        event.stopPropagation();
        setSelectedIndex(
          state.selectedIndex === 0 ? filteredItems.length - 1 : state.selectedIndex - 1,
        );
      } else if (event.key === KEYS.ENTER) {
        if (state.isOpen) {
          event.preventDefault();
          event.stopPropagation();
          executeSelected();
        }
      } else if (event.key === KEYS.ESCAPE) {
        if (state.isOpen) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
      }
    };

    // Handle keyup for search updates
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.isComposing) return;
      if (event.key === KEYS.ARROW_DOWN || event.key === KEYS.ARROW_UP) return;
      if (!state.isOpen) return;

      const slate = Blocks.getBlockSlate(editor, { at: editor.path.current });
      if (!slate?.selection) return;

      const parentPath = Path.parent(slate.selection.anchor.path);
      const text = Editor.string(slate, parentPath);

      if (text.length === 0) {
        close();
        return;
      }

      const searchText = text.replace(trigger, '').trim();

      setSearch(searchText);
    };

    slateEl.addEventListener('keydown', handleKeyDown);
    slateEl.addEventListener('keyup', handleKeyUp);

    return () => {
      slateEl.removeEventListener('keydown', handleKeyDown);
      slateEl.removeEventListener('keyup', handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    editor.path.current,
    state.isOpen,
    state.selectedIndex,
    refs.setReference,
    trigger,
    open,
    close,
    setSearch,
    filteredItems.length,
  ]);

  useEffect(() => {
    if (!state.isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!refs.floating?.current?.contains(target)) {
        close();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [state.isOpen, close, refs.floating]);

  useEffect(() => {
    if (!state.isOpen || !isEmpty || state.search.length === 0) return;

    const timeoutId = setTimeout(() => {
      if (isEmpty) {
        close();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [state.isOpen, isEmpty, state.search, close]);

  useEffect(() => {
    if (!state.isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [state.isOpen]);

  const actions = {
    open,
    close,
    setSearch,
    selectItem: setSelectedIndex,
    executeSelected,
  };

  return {
    refs,
    state,
    items,
    isEmpty,
    actions,
    groupedItems,
    filteredItems,
    floatingStyles,
    transitionStyles,
    isMounted,
  };
}
