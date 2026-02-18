import { useEffect, useState } from 'react';
import { useYooptaEditor } from '@yoopta/editor';

import type { EmojiState, EmojiYooEditor } from '../types';
import { INITIAL_EMOJI_STATE } from '../types';

/**
 * Hook to track emoji picker state.
 * Useful for showing indicators or custom UI while typing an emoji shortcode.
 */
export function useEmojiState() {
  const baseEditor = useYooptaEditor();
  const editor = baseEditor as unknown as EmojiYooEditor;
  const [state, setState] = useState<EmojiState>(INITIAL_EMOJI_STATE);

  // Type-safe event helpers — custom emoji events are added at runtime via withEmoji
  const on = editor.on as (event: string, fn: (...args: any[]) => void) => void;
  const off = editor.off as (event: string, fn: (...args: any[]) => void) => void;

  useEffect(() => {
    const handleOpen = () => {
      setState({ ...editor.emoji.state });
    };

    const handleClose = () => {
      setState(INITIAL_EMOJI_STATE);
    };

    const handleQueryChange = () => {
      setState({ ...editor.emoji.state });
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

  return {
    /** Whether user is currently typing an emoji shortcode */
    isTypingEmoji: state.isOpen,
    /** The current trigger (if dropdown is open) */
    currentTrigger: state.trigger,
    /** Current search query */
    query: state.query,
    /** Position rect for custom positioning */
    targetRect: state.targetRect,
  };
}

/**
 * Hook to check if a specific trigger is active.
 */
export function useEmojiTriggerActive(triggerChar: string): boolean {
  const { isTypingEmoji, currentTrigger } = useEmojiState();
  return isTypingEmoji && currentTrigger?.char === triggerChar;
}
