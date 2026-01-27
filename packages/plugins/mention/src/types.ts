import type { SlateElement, YooEditor } from '@yoopta/editor';

// ============================================================================
// MENTION ITEM TYPES
// ============================================================================

export type MentionType = 'user' | 'channel' | 'page' | 'custom' | string;

export type MentionItem<TMeta = Record<string, unknown>> = {
  id: string;
  type?: MentionType;
  name: string;
  avatar?: string;
  meta?: TMeta;
};

// ============================================================================
// MENTION ELEMENT TYPES
// ============================================================================

export type MentionElementProps<TMeta = Record<string, unknown>> = {
  id: string;
  type?: MentionType;
  name: string;
  avatar?: string;
  meta?: TMeta;
  nodeType: 'inlineVoid';
};

export type MentionPluginElementKeys = 'mention';
export type MentionElement<TMeta = Record<string, unknown>> = SlateElement<
  'mention',
  MentionElementProps<TMeta>
>;

export type MentionElementMap = {
  mention: MentionElement;
};

// ============================================================================
// TRIGGER TYPES
// ============================================================================

export type MentionTrigger = {
  /** Character(s) that trigger the mention dropdown (e.g., '@', '#', '[[') */
  char: string;
  /** Optional type to categorize this trigger */
  type?: MentionType;
  /** Allow spaces in search query (default: false) */
  allowSpaces?: boolean;
  /** Pattern that must precede the trigger (default: /\s|^/ - whitespace or start) */
  allowedAfter?: RegExp;
};

// ============================================================================
// MENTION STATE TYPES
// ============================================================================

export type MentionTargetRect = {
  domRect: DOMRect;
  clientRects: DOMRectList;
};

export type MentionState = {
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Current search query (without trigger char) */
  query: string;
  /** The trigger that opened the dropdown */
  trigger: MentionTrigger | null;
  /** Position for the dropdown */
  targetRect: MentionTargetRect | null;
  /** The range where trigger was typed (for replacement) */
  triggerRange: {
    blockId: string;
    path: number[];
    startOffset: number;
  } | null;
};

export const INITIAL_MENTION_STATE: MentionState = {
  isOpen: false,
  query: '',
  trigger: null,
  targetRect: null,
  triggerRange: null,
};

// ============================================================================
// PLUGIN OPTIONS
// ============================================================================

export type MentionPluginOptions<TMeta = Record<string, unknown>> = {
  /**
   * Multiple triggers configuration
   * Example: [{ char: '@', type: 'user' }, { char: '#', type: 'channel' }]
   */
  triggers?: MentionTrigger[];

  /**
   * Simple single trigger (shorthand for triggers: [{ char }])
   * @default '@'
   */
  char?: string;

  /**
   * Search function called when user types after trigger
   * Receives query (without trigger char) and the active trigger
   */
  onSearch: (query: string, trigger: MentionTrigger) => Promise<MentionItem<TMeta>[]>;

  /**
   * Debounce delay for search in milliseconds
   * @default 300
   */
  debounceMs?: number;

  /**
   * Minimum query length before triggering search
   * @default 0
   */
  minQueryLength?: number;

  /**
   * Called when a mention is selected
   */
  onSelect?: (item: MentionItem<TMeta>, trigger: MentionTrigger) => void;

  /**
   * Called when dropdown opens
   */
  onOpen?: (trigger: MentionTrigger) => void;

  /**
   * Called when dropdown closes
   */
  onClose?: () => void;

  /**
   * Close dropdown when item is selected
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * Close dropdown on click outside
   * @default true
   */
  closeOnClickOutside?: boolean;

  /**
   * Close dropdown on Escape key
   * @default true
   */
  closeOnEscape?: boolean;
};

// ============================================================================
// EVENT TYPES
// ============================================================================

export type MentionOpenEvent = {
  trigger: MentionTrigger;
  query: string;
  targetRect: MentionTargetRect;
};

export type MentionCloseEvent = {
  reason: 'escape' | 'click-outside' | 'select' | 'manual' | 'backspace';
};

export type MentionQueryChangeEvent = {
  query: string;
  trigger: MentionTrigger;
};

export type MentionSelectEvent<TMeta = Record<string, unknown>> = {
  item: MentionItem<TMeta>;
  trigger: MentionTrigger;
};

// ============================================================================
// HOOK TYPES
// ============================================================================

export type UseMentionDropdownOptions = {
  /** Custom debounce override */
  debounceMs?: number;
};

export type UseMentionDropdownReturn<TMeta = Record<string, unknown>> = {
  // State
  isOpen: boolean;
  query: string;
  trigger: MentionTrigger | null;

  // Results
  items: MentionItem<TMeta>[];
  loading: boolean;
  error: Error | null;

  // Navigation
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;

  // Actions
  selectItem: (item: MentionItem<TMeta>) => void;
  close: (reason?: MentionCloseEvent['reason']) => void;

  // Refs for floating-ui
  refs: {
    setFloating: (el: HTMLElement | null) => void;
    setReference: (virtualEl: {
      getBoundingClientRect: () => DOMRect;
      getClientRects?: () => DOMRectList;
    }) => void;
  };
  floatingStyles: React.CSSProperties;
};

// ============================================================================
// RENDER PROPS TYPES (for custom rendering)
// ============================================================================

export type MentionRenderProps<TMeta = Record<string, unknown>> = {
  element: MentionElement<TMeta>;
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  selected: boolean;
  focused: boolean;
};

export type MentionDropdownRenderProps<TMeta = Record<string, unknown>> =
  UseMentionDropdownReturn<TMeta>;

export type MentionItemRenderProps<TMeta = Record<string, unknown>> = {
  item: MentionItem<TMeta>;
  index: number;
  selected: boolean;
  onSelect: () => void;
};

// ============================================================================
// EDITOR EXTENSION
// ============================================================================

export interface MentionEditor {
  mentions: {
    state: MentionState;
    setState: (state: Partial<MentionState>) => void;
    open: (params: {
      trigger: MentionTrigger;
      targetRect: MentionTargetRect;
      triggerRange: MentionState['triggerRange'];
    }) => void;
    close: (reason?: MentionCloseEvent['reason']) => void;
    setQuery: (query: string) => void;
  };
}

declare module '@yoopta/editor' {
  interface YooEditor extends MentionEditor {}
}
