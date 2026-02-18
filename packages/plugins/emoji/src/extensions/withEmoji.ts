import type { YooEditor } from '@yoopta/editor';

import type {
  EmojiCloseEvent,
  EmojiPluginOptions,
  EmojiState,
  EmojiTargetRect,
  EmojiTrigger,
  EmojiYooEditor,
} from '../types';
import { INITIAL_EMOJI_STATE } from '../types';

// Type-safe emit helper for emoji events
type EmojiEmit = (event: string, payload: unknown) => void;

export function withEmoji(editor: YooEditor): EmojiYooEditor {
  const emojiEditor = editor as EmojiYooEditor;

  let state: EmojiState = { ...INITIAL_EMOJI_STATE };

  // Cast emit to allow custom emoji events
  const emit = editor.emit as EmojiEmit;
  const { plugins } = editor;

  emojiEditor.emoji = {
    get state() {
      return state;
    },
    setState: (newState: Partial<EmojiState>) => {
      state = { ...state, ...newState };
    },
    open: (params: {
      trigger: EmojiTrigger;
      targetRect: EmojiTargetRect;
      triggerRange: EmojiState['triggerRange'];
    }) => {
      const pluginOptions = plugins.Emoji?.options as EmojiPluginOptions | undefined;

      state = {
        isOpen: true,
        query: '',
        trigger: params.trigger,
        targetRect: params.targetRect,
        triggerRange: params.triggerRange,
      };

      emit('emoji:open', {
        trigger: params.trigger,
        query: '',
        targetRect: params.targetRect,
      });

      if (pluginOptions?.onOpen) {
        pluginOptions.onOpen(params.trigger);
      }
    },
    close: (reason: EmojiCloseEvent['reason'] = 'manual') => {
      const pluginOptions = plugins.Emoji?.options as EmojiPluginOptions | undefined;

      state = { ...INITIAL_EMOJI_STATE };

      emit('emoji:close', { reason });

      if (pluginOptions?.onClose) {
        pluginOptions.onClose();
      }
    },
    setQuery: (query: string) => {
      state = { ...state, query };

      emit('emoji:query-change', {
        query,
        trigger: state.trigger,
      });
    },
    selectCurrentItem: null,
  };

  return emojiEditor;
}
