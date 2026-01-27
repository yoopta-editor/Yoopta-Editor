import { Mention, ensureMentionState } from './plugin/mention-plugin';

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// COMMANDS
// ============================================================================

export { MentionCommands } from './commands';
export type { MentionCommandsType } from './commands';

// ============================================================================
// HOOKS
// ============================================================================

export { useMentionDropdown, useMentionState, useMentionTriggerActive } from './hooks';

// ============================================================================
// PLUGIN
// ============================================================================

export { ensureMentionState };
export default Mention;
