import { Mention } from './plugin/mention-plugin';

export type {
  // Item types
  MentionType,
  MentionItem,
  // Element types
  MentionElementProps,
  MentionElement,
  MentionElementMap,
  MentionPluginElementKeys,
  // Trigger types
  MentionTrigger,
  // State types
  MentionTargetRect,
  MentionState,
  // Plugin options
  MentionPluginOptions,
  // Event types
  MentionOpenEvent,
  MentionCloseEvent,
  MentionQueryChangeEvent,
  MentionSelectEvent,
  // Hook types
  UseMentionDropdownOptions,
  UseMentionDropdownReturn,
  // Render props types
  MentionRenderProps,
  MentionDropdownRenderProps,
  MentionItemRenderProps,
  // Editor extension
  MentionEditor,
} from './types';

export { INITIAL_MENTION_STATE } from './types';

export { MentionCommands } from './commands/mention-commands';
export type { MentionCommandsType } from './commands/mention-commands';

export { useMentionDropdown, useMentionState, useMentionTriggerActive } from './hooks';

export { withMentions } from './extenstions/withMentions';

export default Mention;
