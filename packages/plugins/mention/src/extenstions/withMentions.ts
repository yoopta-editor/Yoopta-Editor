
/**
 * Ensures editor has mention state initialized
 * Called lazily when needed
 */

import type { YooEditor } from "@yoopta/editor";

import type { MentionCloseEvent, MentionPluginOptions, MentionState, MentionTargetRect, MentionTrigger, MentionYooEditor } from "../types";
import { INITIAL_MENTION_STATE } from "../types";

// Type-safe emit helper for mention events
type MentionEmit = (event: string, payload: unknown) => void;

// [TODO] - add throw error if this extenstion not applied to editor instance
export function withMentions(editor: YooEditor): MentionYooEditor {
  const mentionEditor = editor as MentionYooEditor;

  let state: MentionState = { ...INITIAL_MENTION_STATE };

  // Cast emit to allow custom mention events
  const emit = editor.emit as MentionEmit;
  const { plugins } = editor;

  mentionEditor.mentions = {
    get state() {
      return state;
    },
    setState: (newState: Partial<MentionState>) => {
      state = { ...state, ...newState };
    },
    open: (params: {
      trigger: MentionTrigger;
      targetRect: MentionTargetRect;
      triggerRange: MentionState['triggerRange'];
    }) => {
      const pluginOptions = plugins.Mention?.options as MentionPluginOptions | undefined;

      state = {
        isOpen: true,
        query: '',
        trigger: params.trigger,
        targetRect: params.targetRect,
        triggerRange: params.triggerRange,
      };

      emit('mention:open', {
        trigger: params.trigger,
        query: '',
        targetRect: params.targetRect,
      });

      if (pluginOptions?.onOpen) {
        pluginOptions.onOpen(params.trigger);
      }
    },
    close: (reason: MentionCloseEvent['reason'] = 'manual') => {
      const pluginOptions = plugins.Mention?.options as MentionPluginOptions | undefined;

      state = { ...INITIAL_MENTION_STATE };

      emit('mention:close', { reason });

      if (pluginOptions?.onClose) {
        pluginOptions.onClose();
      }
    },
    setQuery: (query: string) => {
      state = { ...state, query };

      emit('mention:query-change', {
        query,
        trigger: state.trigger,
      });
    },
  };

  return mentionEditor;
}
