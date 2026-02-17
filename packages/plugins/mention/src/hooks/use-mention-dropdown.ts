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

import { MentionCommands } from '../commands/mention-commands';
import type {
  MentionCloseEvent,
  MentionItem,
  MentionPluginOptions,
  MentionState,
  UseMentionDropdownOptions,
  UseMentionDropdownReturn,
} from '../types';
import { INITIAL_MENTION_STATE } from '../types';

/**
 * Hook for building mention dropdown UI
 * Provides state, actions, and floating-ui refs
 */
export function useMentionDropdown<TMeta = Record<string, unknown>>(
  options: UseMentionDropdownOptions = {},
): UseMentionDropdownReturn<TMeta> {
  const editor = useYooptaEditor();
  const pluginOptions = useYooptaPluginOptions<MentionPluginOptions<TMeta>>('Mention');

  // Local state for items/loading
  const [items, setItems] = useState<MentionItem<TMeta>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Track mention state from editor
  const [mentionState, setMentionState] = useState<MentionState>(INITIAL_MENTION_STATE);

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQueryRef = useRef<string>('');

  // Debounce settings
  const debounceMs = options.debounceMs ?? pluginOptions?.debounceMs ?? 300;
  const minQueryLength = pluginOptions?.minQueryLength ?? 0;

  // Floating UI setup
  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    open: mentionState.isOpen,
    middleware: [inline(), flip(), shift({ padding: 8 }), offset(4)],
    whileElementsMounted: autoUpdate,
  });

  // Sync editor mention state to local state
  useEffect(() => {
    const handleMentionOpen = () => {
      setMentionState({ ...editor.mentions.state });
      setSelectedIndex(0);
      setItems([]);
      setError(null);
    };

    const handleMentionClose = () => {
      setMentionState({ ...INITIAL_MENTION_STATE });
      setItems([]);
      setSelectedIndex(0);
      setError(null);
    };

    const handleQueryChange = () => {
      setMentionState({ ...editor.mentions.state });
    };

    editor.on('mention:open', handleMentionOpen);
    editor.on('mention:close', handleMentionClose);
    editor.on('mention:query-change', handleQueryChange);

    return () => {
      editor.off('mention:open', handleMentionOpen);
      editor.off('mention:close', handleMentionClose);
      editor.off('mention:query-change', handleQueryChange);
    };
  }, [editor]);

  // Update floating reference when target changes
  useEffect(() => {
    if (mentionState.targetRect) {
      refs.setReference({
        getBoundingClientRect: () => mentionState.targetRect!.domRect,
        getClientRects: () => mentionState.targetRect!.clientRects,
      });
    }
  }, [mentionState.targetRect, refs]);

  // Fetch items when query changes
  useEffect(() => {
    if (!mentionState.isOpen || !pluginOptions?.onSearch) return;

    const query = mentionState.query;
    const trigger = mentionState.trigger;

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
        const results = await pluginOptions?.onSearch?.(query, trigger);
        setItems(results as MentionItem<TMeta>[]);
        setSelectedIndex(0);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Search failed'));
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
  }, [mentionState.isOpen, mentionState.query, mentionState.trigger, pluginOptions, debounceMs, minQueryLength, items.length]);

  // Select item action
  const selectItem = useCallback(
    (item: MentionItem<TMeta>) => {
      MentionCommands.insertMention(editor, item, { focus: true });
    },
    [editor],
  );

  // Close action
  const close = useCallback(
    (reason: MentionCloseEvent['reason'] = 'manual') => {
      MentionCommands.closeDropdown(editor, reason);
    },
    [editor],
  );

  // Expose selectCurrentItem on editor.mentions so the plugin's onKeyDown can
  // call it directly on Enter (avoiding event propagation issues with block handlers).
  useEffect(() => {
    if (mentionState.isOpen && items.length > 0) {
      editor.mentions.selectCurrentItem = () => {
        if (items[selectedIndex]) {
          selectItem(items[selectedIndex]);
        }
      };
    } else {
      editor.mentions.selectCurrentItem = null;
    }

    return () => {
      editor.mentions.selectCurrentItem = null;
    };
  }, [mentionState.isOpen, items, selectedIndex, selectItem, editor]);

  // Keyboard navigation (Arrow keys, Escape, Tab)
  // Enter is handled directly by the plugin's onKeyDown via editor.mentions.selectCurrentItem
  useEffect(() => {
    if (!mentionState.isOpen) return;

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
        case 'Escape':
          e.preventDefault();
          close('escape');
          break;
        case 'Tab':
          // Close on tab
          close('escape');
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mentionState.isOpen, items, selectedIndex, close]);

  // Click outside to close
  useEffect(() => {
    if (!mentionState.isOpen) return;
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
  }, [mentionState.isOpen, refs.floating, close, pluginOptions?.closeOnClickOutside]);

  return useMemo(
    () => ({
      // State
      isOpen: mentionState.isOpen,
      query: mentionState.query,
      trigger: mentionState.trigger,

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
      mentionState.isOpen,
      mentionState.query,
      mentionState.trigger,
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
