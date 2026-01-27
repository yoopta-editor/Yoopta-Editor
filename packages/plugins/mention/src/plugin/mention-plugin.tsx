import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { BaseYooEditor, PluginElementRenderProps } from '@yoopta/editor';
import { Blocks, YooptaPlugin, generateId } from '@yoopta/editor';
import { Node, Range, Text } from 'slate';

import { MentionCommands } from '../commands';
import type {
  MentionCloseEvent,
  MentionElementMap,
  MentionElementProps,
  MentionPluginOptions,
  MentionState,
  MentionTargetRect,
  MentionTrigger,
} from '../types';
import { INITIAL_MENTION_STATE } from '../types';

// Extended editor type with mentions support
type MentionYooEditor = BaseYooEditor & {
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
};

// ============================================================================
// DEFAULT RENDER (headless - just renders inline)
// ============================================================================

const DefaultMentionRender = (props: PluginElementRenderProps) => {
  const { element, attributes, children } = props;
  const { name } = element.props as MentionElementProps;

  return (
    <span {...attributes} contentEditable={false} data-mention>
      @{name}
      {children}
    </span>
  );
};

// ============================================================================
// HELPER: Get triggers from options
// ============================================================================

function getTriggers(options: MentionPluginOptions | undefined): MentionTrigger[] {
  if (!options) return [{ char: '@' }];

  if (options.triggers && options.triggers.length > 0) {
    return options.triggers;
  }

  return [{ char: options.char ?? '@' }];
}

// ============================================================================
// HELPER: Check if trigger should activate
// ============================================================================

function shouldTriggerActivate(
  trigger: MentionTrigger,
  charBefore: string,
  charAfter: string,
): boolean {
  const allowedAfter = trigger.allowedAfter ?? /^$|\s/;

  // Check if character before trigger matches pattern (whitespace or start)
  const isLeftClear = allowedAfter.test(charBefore);
  // Check if character after is whitespace or end (for multi-char triggers like '[[')
  const isRightClear = charAfter === '' || /\s/.test(charAfter);

  return isLeftClear && isRightClear;
}

// ============================================================================
// HELPER: Get caret position rect
// ============================================================================

function getCaretRect(): MentionTargetRect | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const rects = range.getClientRects();

  // If no rects (e.g., empty line), use range bounding rect
  if (rects.length === 0) {
    const boundingRect = range.getBoundingClientRect();
    // Create a minimal DOMRectList-like object
    return {
      domRect: boundingRect,
      clientRects: range.getClientRects(),
    };
  }

  return {
    domRect: range.getBoundingClientRect(),
    clientRects: rects,
  };
}

// ============================================================================
// LAZY INITIALIZATION (must be defined before plugin)
// ============================================================================

/**
 * Ensures editor has mention state initialized
 * Called lazily when needed
 */
// Type-safe emit helper for mention events
type MentionEmit = (event: string, payload: unknown) => void;

function ensureMentionState(editor: BaseYooEditor): void {
  const mentionEditor = editor as MentionYooEditor;

  // Already initialized
  if (mentionEditor.mentions) return;

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
}

// ============================================================================
// PLUGIN DEFINITION
// ============================================================================

const Mention = new YooptaPlugin<MentionElementMap, MentionPluginOptions>({
  type: 'Mention',
  elements: {
    mention: {
      render: DefaultMentionRender,
      props: {
        id: '',
        name: '',
        avatar: '',
        type: undefined,
        meta: undefined,
        nodeType: 'inlineVoid',
      },
    },
  },
  options: {
    display: {
      title: 'Mention',
      description: 'Mention a user or resource',
    },
    char: '@',
  },
  commands: MentionCommands,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['SPAN'],
        parse: (el) => {
          if (el.nodeName === 'SPAN' && el.dataset.mentionId) {
            return {
              id: generateId(),
              type: 'mention',
              children: [{ text: '' }],
              props: {
                id: el.dataset.mentionId ?? '',
                name: el.dataset.mentionName ?? el.textContent ?? '',
                avatar: el.dataset.mentionAvatar ?? '',
                type: el.dataset.mentionType ?? undefined,
                nodeType: 'inlineVoid',
              },
            };
          }
        },
      },
      serialize: (element) => {
        const { id, name, avatar, type } = element.props ?? {};
        return `<span data-mention data-mention-id="${id}" data-mention-name="${name}" data-mention-avatar="${avatar ?? ''}" data-mention-type="${type ?? ''}" style="color: #2563eb; font-weight: 500;">@${name}</span>`;
      },
    },
    markdown: {
      serialize: (element) => `@${element.props?.name ?? ''}`,
    },
    email: {
      serialize: (element) => {
        const { name } = element.props ?? {};
        return `<span style="color: #2563eb; font-weight: 500;">@${name}</span>`;
      },
    },
  },
  extensions: (slate) => {
    const { markableVoid, isInline } = slate;

    slate.markableVoid = (element) => element.type === 'mention' || markableVoid(element);
    slate.isInline = (element) => element.type === 'mention' || isInline(element);

    return slate;
  },
  events: {
    onKeyDown: (baseEditor, slate, _options) => (event: ReactKeyboardEvent) => {
      // Ensure mention state is initialized
      ensureMentionState(baseEditor);

      // Cast to MentionYooEditor for full type support
      const editor = baseEditor as MentionYooEditor;

      const pluginOptions = baseEditor.plugins.Mention?.options as MentionPluginOptions | undefined;
      const triggers = getTriggers(pluginOptions);
      const mentionState = editor.mentions.state;

      // Check if any trigger char was typed
      for (const trigger of triggers) {
        if (event.key === trigger.char || (trigger.char.length > 1 && event.key === trigger.char[trigger.char.length - 1])) {
          // For single char triggers
          if (trigger.char.length === 1 && event.key === trigger.char) {
            if (slate.selection && Range.isCollapsed(slate.selection)) {
              const currentNode = Node.get(slate, slate.selection.anchor.path);
              if (!Text.isText(currentNode)) return;

              const text = currentNode.text;
              const cursorOffset = slate.selection.anchor.offset;

              const charBefore = text[cursorOffset - 1] ?? '';
              const charAfter = text[cursorOffset] ?? '';

              if (!shouldTriggerActivate(trigger, charBefore, charAfter)) return;

              const block = Blocks.getBlock(baseEditor, { at: baseEditor.path.current });
              if (!block) return;

              // Get caret position for dropdown positioning
              const caretRect = getCaretRect();
              if (!caretRect) return;

              // Open dropdown
              editor.mentions.open({
                trigger,
                targetRect: caretRect,
                triggerRange: {
                  blockId: block.id,
                  path: slate.selection.anchor.path,
                  startOffset: cursorOffset,
                },
              });
            }
          }
          // TODO: Handle multi-char triggers like '[['
        }
      }

      // Handle keys when dropdown is open
      if (mentionState.isOpen) {
        const { key } = event;

        // Escape closes dropdown
        if (key === 'Escape' && pluginOptions?.closeOnEscape !== false) {
          event.preventDefault();
          editor.mentions.close('escape');
          return;
        }

        // Backspace updates query
        if (key === 'Backspace') {
          const newQuery = mentionState.query.slice(0, -1);

          // If query becomes empty and we backspace again, close
          if (mentionState.query.length === 0) {
            editor.mentions.close('backspace');
            return;
          }

          editor.mentions.setQuery(newQuery);
          return;
        }

        // Regular characters add to query
        if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const currentTrigger = mentionState.trigger;

          // Check if spaces are allowed
          if (key === ' ' && !currentTrigger?.allowSpaces) {
            editor.mentions.close('manual');
            return;
          }

          // Don't add trigger char to query
          if (currentTrigger && key === currentTrigger.char) {
            return;
          }

          editor.mentions.setQuery(mentionState.query + key);
        }
      }
    },
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export { Mention, ensureMentionState };
