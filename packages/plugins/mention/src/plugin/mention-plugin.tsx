import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { YooptaPlugin, generateId } from '@yoopta/editor';
import { Node, Range, Text } from 'slate';

import { MentionCommands } from '../commands/mention-commands';
import type {
  MentionElementMap,
  MentionElementProps,
  MentionPluginOptions,
  MentionYooEditor,
} from '../types';
import { getCaretRectFromSlate, getTriggers, shouldTriggerActivate } from '../utils';

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

const defaultMentionProps = {
  id: '',
  name: '',
  avatar: '',
  type: undefined,
  meta: undefined,
};

const Mention = new YooptaPlugin<MentionElementMap, MentionPluginOptions>({
  type: 'Mention',
  elements: (
    <mention
      render={DefaultMentionRender}
      props={defaultMentionProps}
      nodeType="inlineVoid"
    />
  ),
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
    onKeyDown: (baseEditor, slate, options) => (event: ReactKeyboardEvent) => {
      // Cast to MentionYooEditor for full type support
      const editor = baseEditor as MentionYooEditor;

      const pluginOptions = baseEditor.plugins.Mention?.options as MentionPluginOptions | undefined;
      const triggers = getTriggers(pluginOptions);
      const mentionState = editor.mentions.state;

      // Get current block from options (more reliable than editor.path.current)
      const currentBlock = options.currentBlock;

      // Check if any trigger char was typed
      for (const trigger of triggers) {
        // Check for single char trigger match
        if (trigger.char.length === 1 && event.key === trigger.char) {
          // Only handle if selection is collapsed (cursor, not range)
          if (slate.selection && Range.isCollapsed(slate.selection)) {
            const currentNode = Node.get(slate, slate.selection.anchor.path);
            if (!Text.isText(currentNode)) continue;

            const text = currentNode.text;
            const cursorOffset = slate.selection.anchor.offset;

            const charBefore = text[cursorOffset - 1] ?? '';
            const charAfter = text[cursorOffset] ?? '';

            // Check if trigger should activate
            if (!shouldTriggerActivate(trigger, charBefore, charAfter)) continue;

            if (!currentBlock) continue;

            // Get caret position for dropdown positioning
            // Get position BEFORE @ is inserted (current cursor position)
            const caretRect = getCaretRectFromSlate(slate);
            if (!caretRect) continue;

            // Open dropdown immediately (before @ is inserted)
            // The @ character will be inserted by Slate's default behavior
            editor.mentions.open({
              trigger,
              targetRect: caretRect,
              triggerRange: {
                blockId: currentBlock.id,
                path: slate.selection.anchor.path,
                startOffset: cursorOffset, // Position where @ will be inserted
              },
            });

            // Don't prevent default - let the @ character be inserted
            return;
          }
        }
        // TODO: Handle multi-char triggers like '[['
      }

      // Handle keys when dropdown is open
      if (mentionState.isOpen) {
        const { key } = event;

        // Enter inserts the currently selected mention and prevents block handlers
        if (key === 'Enter') {
          event.preventDefault();
          if (editor.mentions.selectCurrentItem) {
            editor.mentions.selectCurrentItem();
          }
          return;
        }

        // Arrow keys navigate the dropdown — prevent block handlers from running
        if (key === 'ArrowUp' || key === 'ArrowDown') {
          event.preventDefault();
          return;
        }

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

export { Mention };
