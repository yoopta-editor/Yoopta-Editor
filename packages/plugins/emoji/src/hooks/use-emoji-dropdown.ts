import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  autoUpdate,
  flip,
  inline,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { useYooptaEditor, useYooptaPluginOptions } from '@yoopta/editor';

import { EmojiCommands } from '../commands/emoji-commands';
import { defaultEmojiSearch } from '../data/default-search';
import type {
  EmojiCloseEvent,
  EmojiItem,
  EmojiPluginOptions,
  EmojiState,
  EmojiYooEditor,
  UseEmojiDropdownOptions,
  UseEmojiDropdownReturn,
} from '../types';
import { INITIAL_EMOJI_STATE } from '../types';

/**
 * Hook for building emoji dropdown UI.
 * Provides state, actions, and floating-ui refs.
 */
export function useEmojiDropdown(
  options: UseEmojiDropdownOptions = {},
): UseEmojiDropdownReturn {
  const baseEditor = useYooptaEditor();
  const editor = baseEditor as unknown as EmojiYooEditor;
  const pluginOptions = useYooptaPluginOptions<EmojiPluginOptions>('Emoji');

  // Local state for items/loading
  const [items, setItems] = useState<EmojiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Track emoji state from editor
  const [emojiState, setEmojiState] = useState<EmojiState>(INITIAL_EMOJI_STATE);

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQueryRef = useRef<string>('');

  // Debounce settings — emoji search is typically local so default is lower
  const debounceMs = options.debounceMs ?? pluginOptions?.debounceMs ?? 100;
  const minQueryLength = pluginOptions?.minQueryLength ?? 1;

  // Floating UI setup
  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    open: emojiState.isOpen,
    middleware: [inline(), flip(), shift({ padding: 8 }), offset(4)],
    whileElementsMounted: autoUpdate,
  });

  // Type-safe event helpers — custom emoji events are added at runtime via withEmoji
  const on = editor.on as (event: string, fn: (...args: any[]) => void) => void;
  const off = editor.off as (event: string, fn: (...args: any[]) => void) => void;

  // Sync editor emoji state to local state
  useEffect(() => {
    const handleOpen = () => {
      setEmojiState({ ...editor.emoji.state });
      setSelectedIndex(0);
      setItems([]);
      setError(null);
    };

    const handleClose = () => {
      setEmojiState({ ...INITIAL_EMOJI_STATE });
      setItems([]);
      setSelectedIndex(0);
      setError(null);
    };

    const handleQueryChange = () => {
      setEmojiState({ ...editor.emoji.state });
    };

    on('emoji:open', handleOpen);
    on('emoji:close', handleClose);
    on('emoji:query-change', handleQueryChange);

    return () => {
      off('emoji:open', handleOpen);
      off('emoji:close', handleClose);
      off('emoji:query-change', handleQueryChange);
    };
  }, [editor]);

  // Update floating reference when target changes
  useEffect(() => {
    if (emojiState.targetRect) {
      refs.setReference({
        getBoundingClientRect: () => emojiState.targetRect!.domRect,
        getClientRects: () => emojiState.targetRect!.clientRects,
      });
    }
  }, [emojiState.targetRect, refs]);

  // Fetch items when query changes
  useEffect(() => {
    if (!emojiState.isOpen) return;

    const query = emojiState.query;
    const trigger = emojiState.trigger;
    const searchFn = pluginOptions?.onSearch ?? defaultEmojiSearch;

    // Skip if query is same as last
    if (query === lastQueryRef.current && items.length > 0) return;
    lastQueryRef.current = query;

    // Check min query length
    if (query.length < minQueryLength) {
      setItems([]);
      return;
    }

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce search
    debounceTimerRef.current = setTimeout(async () => {
      if (!trigger) return;

      setLoading(true);
      setError(null);

      try {
        const results = await searchFn(query, trigger);
        setItems(results);
        setSelectedIndex(0);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Emoji search failed'));
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [emojiState.isOpen, emojiState.query, emojiState.trigger, pluginOptions, debounceMs, minQueryLength, items.length]);

  // Select item action
  const selectItem = useCallback(
    (item: EmojiItem) => {
      EmojiCommands.insertEmoji(editor, item);
    },
    [editor],
  );

  // Close action
  const close = useCallback(
    (reason: EmojiCloseEvent['reason'] = 'manual') => {
      EmojiCommands.closeDropdown(editor, reason);
    },
    [editor],
  );

  // Keyboard navigation
  useEffect(() => {
    if (!emojiState.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % Math.max(items.length, 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (items[selectedIndex]) {
            selectItem(items[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          close('escape');
          break;
        case 'Tab':
          close('escape');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [emojiState.isOpen, items, selectedIndex, selectItem, close]);

  // Click outside to close
  useEffect(() => {
    if (!emojiState.isOpen) return;
    if (pluginOptions?.closeOnClickOutside === false) return;

    const handleClickOutside = (e: MouseEvent) => {
      const floatingEl = refs.floating.current;
      if (floatingEl && !floatingEl.contains(e.target as Node)) {
        close('click-outside');
      }
    };

    // Delay to avoid immediate close
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [emojiState.isOpen, refs.floating, close, pluginOptions?.closeOnClickOutside]);

  return useMemo(
    () => ({
      // State
      isOpen: emojiState.isOpen,
      query: emojiState.query,
      trigger: emojiState.trigger,

      // Results
      items,
      loading,
      error,

      // Navigation
      selectedIndex,
      setSelectedIndex,

      // Actions
      selectItem,
      close,

      // Refs
      refs: {
        setFloating: refs.setFloating,
        setReference: refs.setReference,
      },
      floatingStyles,
    }),
    [
      emojiState.isOpen,
      emojiState.query,
      emojiState.trigger,
      items,
      loading,
      error,
      selectedIndex,
      selectItem,
      close,
      refs.setFloating,
      refs.setReference,
      floatingStyles,
    ],
  );
}
