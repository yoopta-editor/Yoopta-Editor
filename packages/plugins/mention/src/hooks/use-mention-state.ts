import { useEffect, useState } from 'react';
import { useYooptaEditor } from '@yoopta/editor';

import type { MentionState } from '../types';
import { INITIAL_MENTION_STATE } from '../types';

/**
 * Hook to track mention typing state
 * Useful for showing indicators or custom UI while typing a mention
 */
export function useMentionState() {
  const editor = useYooptaEditor();
  const [state, setState] = useState<MentionState>(INITIAL_MENTION_STATE);

  useEffect(() => {
    const handleOpen = () => {
      setState({ ...editor.mentions.state });
    };

    const handleClose = () => {
      setState(INITIAL_MENTION_STATE);
    };

    const handleQueryChange = () => {
      setState({ ...editor.mentions.state });
    };

    editor.on('mention:open', handleOpen);
    editor.on('mention:close', handleClose);
    editor.on('mention:query-change', handleQueryChange);

    return () => {
      editor.off('mention:open', handleOpen);
      editor.off('mention:close', handleClose);
      editor.off('mention:query-change', handleQueryChange);
    };
  }, [editor]);

  return {
    /** Whether user is currently typing a mention */
    isTypingMention: state.isOpen,
    /** The current trigger (if dropdown is open) */
    currentTrigger: state.trigger,
    /** Current search query */
    query: state.query,
    /** Position rect for custom positioning */
    targetRect: state.targetRect,
  };
}

/**
 * Hook to check if a specific trigger is active
 */
export function useMentionTriggerActive(triggerChar: string): boolean {
  const { isTypingMention, currentTrigger } = useMentionState();
  return isTypingMention && currentTrigger?.char === triggerChar;
}
