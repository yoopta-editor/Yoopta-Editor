import { Emoji } from './plugin/emoji-plugin';

export type {
  // Item types
  EmojiItem,
  // Trigger types
  EmojiTrigger,
  // State types
  EmojiTargetRect,
  EmojiState,
  // Plugin options
  EmojiPluginOptions,
  // Event types
  EmojiOpenEvent,
  EmojiCloseEvent,
  EmojiQueryChangeEvent,
  EmojiSelectEvent,
  // Hook types
  UseEmojiDropdownOptions,
  UseEmojiDropdownReturn,
  // Editor extension
  EmojiEditor,
  EmojiYooEditor,
} from './types';

export { INITIAL_EMOJI_STATE } from './types';

export { EmojiCommands } from './commands/emoji-commands';
export type { EmojiCommandsType } from './commands/emoji-commands';

export { useEmojiDropdown, useEmojiState, useEmojiTriggerActive } from './hooks';

export { withEmoji } from './extensions/withEmoji';

export { EMOJI_DATA } from './data/emoji-data';
export { defaultEmojiSearch } from './data/default-search';

export default Emoji;
