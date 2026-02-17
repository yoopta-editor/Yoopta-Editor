import type { SlateElement, YooEditor } from '@yoopta/editor';

// The emoji element is a transparent inline element — never actually inserted
// into the document. It exists only so the editor's inline-plugin pipeline
// picks up Emoji's onKeyDown. Emoji content is inserted as plain Unicode text.
export type EmojiElement = SlateElement<'emoji', { nodeType: 'inline' }>;
export type EmojiElementMap = { emoji: EmojiElement };

export type EmojiItem = {
  /** Emoji unicode character (e.g., '😀') */
  emoji: string;
  /** Short name without colons (e.g., 'smile') */
  name: string;
  /** Search keywords */
  keywords?: string[];
  /** Category (e.g., 'Smileys & Emotion') */
  category?: string;
};

export type EmojiTrigger = {
  /** Character(s) that trigger the emoji dropdown (default: ':') */
  char: string;
  /** Allow spaces in search query (default: false) */
  allowSpaces?: boolean;
  /** Pattern that must precede the trigger (default: /^$|\s/ — whitespace or start) */
  allowedAfter?: RegExp;
};

export type EmojiTargetRect = {
  domRect: DOMRect;
  clientRects: DOMRectList;
};

export type EmojiState = {
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Current search query (without trigger char) */
  query: string;
  /** The trigger that opened the dropdown */
  trigger: EmojiTrigger | null;
  /** Position for the dropdown */
  targetRect: EmojiTargetRect | null;
  /** The range where trigger was typed (for replacement) */
  triggerRange: {
    blockId: string;
    path: number[];
    startOffset: number;
  } | null;
};

export const INITIAL_EMOJI_STATE: EmojiState = {
  isOpen: false,
  query: '',
  trigger: null,
  targetRect: null,
  triggerRange: null,
};

export type EmojiPluginOptions = {
  /**
   * Multiple triggers configuration
   * Example: [{ char: ':' }]
   */
  triggers?: EmojiTrigger[];

  /**
   * Simple single trigger (shorthand for triggers: [{ char }])
   * @default ':'
   */
  char?: string;

  /**
   * Search function called when user types after trigger.
   * Receives query (without trigger char) and the active trigger.
   * Return matching emoji items.
   *
   * If not provided, uses a built-in emoji dataset with ~400 common emoji.
   */
  onSearch?: (query: string, trigger: EmojiTrigger) => Promise<EmojiItem[]> | EmojiItem[];

  /**
   * Debounce delay for search in milliseconds
   * @default 100
   */
  debounceMs?: number;

  /**
   * Minimum query length before triggering search
   * @default 1
   */
  minQueryLength?: number;

  /**
   * Called when an emoji is selected
   */
  onSelect?: (item: EmojiItem, trigger: EmojiTrigger) => void;

  /**
   * Called when dropdown opens
   */
  onOpen?: (trigger: EmojiTrigger) => void;

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

// Event types

export type EmojiOpenEvent = {
  trigger: EmojiTrigger;
  query: string;
  targetRect: EmojiTargetRect;
};

export type EmojiCloseEvent = {
  reason: 'escape' | 'click-outside' | 'select' | 'manual' | 'backspace';
};

export type EmojiQueryChangeEvent = {
  query: string;
  trigger: EmojiTrigger;
};

export type EmojiSelectEvent = {
  item: EmojiItem;
  trigger: EmojiTrigger;
};

// Hook types

export type UseEmojiDropdownOptions = {
  /** Custom debounce override */
  debounceMs?: number;
};

export type UseEmojiDropdownReturn = {
  // State
  isOpen: boolean;
  query: string;
  trigger: EmojiTrigger | null;

  // Results
  items: EmojiItem[];
  loading: boolean;
  error: Error | null;

  // Navigation
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;

  // Actions
  selectItem: (item: EmojiItem) => void;
  close: (reason?: EmojiCloseEvent['reason']) => void;

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

// Editor extension

export type EmojiEditor = {
  emoji: {
    state: EmojiState;
    setState: (state: Partial<EmojiState>) => void;
    open: (params: {
      trigger: EmojiTrigger;
      targetRect: EmojiTargetRect;
      triggerRange: EmojiState['triggerRange'];
    }) => void;
    close: (reason?: EmojiCloseEvent['reason']) => void;
    setQuery: (query: string) => void;
  };
};

// Extended editor type with emoji support
export type EmojiYooEditor = YooEditor & EmojiEditor;
