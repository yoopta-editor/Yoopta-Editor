import type { YooEditor } from '@yoopta/editor';
import { Blocks } from '@yoopta/editor';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import type {
  EmojiCloseEvent,
  EmojiItem,
  EmojiPluginOptions,
  EmojiState,
  EmojiTargetRect,
  EmojiTrigger,
  EmojiYooEditor,
} from '../types';
import { INITIAL_EMOJI_STATE } from '../types';

// Helper to safely access emoji state
function getEmojiEditor(editor: YooEditor): EmojiYooEditor {
  return editor as EmojiYooEditor;
}

export type EmojiCommandsType = {
  // Insert emoji as plain text, replacing the trigger + query
  insertEmoji: (editor: YooEditor, item: EmojiItem) => void;

  // Dropdown control
  openDropdown: (
    editor: YooEditor,
    params: {
      trigger: EmojiTrigger;
      targetRect: EmojiTargetRect;
      triggerRange: EmojiState['triggerRange'];
    },
  ) => void;
  closeDropdown: (editor: YooEditor, reason?: EmojiCloseEvent['reason']) => void;

  // State
  getState: (editor: YooEditor) => EmojiState;
  getQuery: (editor: YooEditor) => string;
  setQuery: (editor: YooEditor, query: string) => void;
  getTrigger: (editor: YooEditor) => EmojiTrigger | null;

  // Utilities
  getTriggers: (editor: YooEditor) => EmojiTrigger[];
  getTriggerByChar: (editor: YooEditor, char: string) => EmojiTrigger | undefined;
};

export const EmojiCommands: EmojiCommandsType = {
  insertEmoji: (editor, item) => {
    const emojiEditor = getEmojiEditor(editor);
    const state = emojiEditor.emoji.state;
    if (!state.triggerRange) return;

    const { blockId, path, startOffset } = state.triggerRange;
    const slateEditor = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slateEditor) return;

    // Calculate the end offset (trigger char + query length)
    const trigger = state.trigger;
    const query = state.query;
    const triggerLength = trigger?.char.length ?? 1;
    const endOffset = startOffset + triggerLength + query.length;

    // Select the range from trigger start to current position
    Transforms.select(slateEditor, {
      anchor: { path, offset: startOffset },
      focus: { path, offset: endOffset },
    });

    // Delete the trigger + query text, then insert the emoji unicode character
    Transforms.delete(slateEditor);
    Transforms.insertText(slateEditor, item.emoji);

    // Close dropdown
    const pluginOptions = editor.plugins.Emoji?.options as EmojiPluginOptions | undefined;
    if (pluginOptions?.closeOnSelect !== false) {
      emojiEditor.emoji.close('select');
    }

    // Ensure DOM focus stays on the Slate editor without moving the cursor.
    // (focusBlock would reset cursor to start; ReactEditor.focus preserves selection)
    ReactEditor.focus(slateEditor as ReactEditor);

    // Trigger onSelect callback
    if (pluginOptions?.onSelect && trigger) {
      pluginOptions.onSelect(item, trigger);
    }
  },

  openDropdown: (editor, params) => {
    getEmojiEditor(editor).emoji.open(params);
  },

  closeDropdown: (editor, reason = 'manual') => {
    getEmojiEditor(editor).emoji.close(reason);
  },

  getState: (editor) => getEmojiEditor(editor).emoji?.state ?? INITIAL_EMOJI_STATE,

  getQuery: (editor) => getEmojiEditor(editor).emoji?.state.query ?? '',

  setQuery: (editor, query) => {
    getEmojiEditor(editor).emoji.setQuery(query);
  },

  getTrigger: (editor) => getEmojiEditor(editor).emoji?.state.trigger ?? null,

  getTriggers: (editor) => {
    const options = editor.plugins.Emoji?.options as EmojiPluginOptions | undefined;
    if (!options) return [{ char: ':' }];

    if (options.triggers && options.triggers.length > 0) {
      return options.triggers;
    }

    return [{ char: options.char ?? ':' }];
  },

  getTriggerByChar: (editor, char) => {
    const triggers = EmojiCommands.getTriggers(editor);
    return triggers.find((t) => t.char === char);
  },
};
