import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { YooptaPlugin } from '@yoopta/editor';
import { Node, Range, Text } from 'slate';

import { EmojiCommands } from '../commands/emoji-commands';
import type { EmojiElementMap, EmojiPluginOptions, EmojiYooEditor } from '../types';
import { getCaretRectFromSlate, getTriggers, shouldTriggerActivate } from '../utils';

// Transparent inline render — never actually inserted, exists only so the
// editor's inline-plugin event-handler pipeline picks up Emoji's onKeyDown.
const EmojiRender = (props: PluginElementRenderProps) => (
  <span {...props.attributes}>{props.children}</span>
);

const Emoji = new YooptaPlugin<EmojiElementMap, EmojiPluginOptions>({
  type: 'Emoji',
  // eslint-disable-next-line react/no-unknown-property
  elements: <emoji render={EmojiRender} props={{ nodeType: 'inline' }} nodeType="inline" />,
  options: {
    display: {
      title: 'Emoji',
      description: 'Insert emoji with :shortcode',
    },
  },
  commands: EmojiCommands,
  events: {
    onKeyDown: (baseEditor, slate, options) => (event: ReactKeyboardEvent) => {
      const editor = baseEditor as EmojiYooEditor;

      const pluginOptions = baseEditor.plugins.Emoji?.options as EmojiPluginOptions | undefined;
      const triggers = getTriggers(pluginOptions);
      const emojiState = editor.emoji.state;

      const currentBlock = options.currentBlock;

      // Check if any trigger char was typed
      for (const trigger of triggers) {
        if (trigger.char.length === 1 && event.key === trigger.char) {
          // Only handle if selection is collapsed
          if (slate.selection && Range.isCollapsed(slate.selection)) {
            const currentNode = Node.get(slate, slate.selection.anchor.path);
            if (!Text.isText(currentNode)) continue;

            const text = currentNode.text;
            const cursorOffset = slate.selection.anchor.offset;

            const charBefore = text[cursorOffset - 1] ?? '';
            const charAfter = text[cursorOffset] ?? '';

            if (!shouldTriggerActivate(trigger, charBefore, charAfter)) continue;

            if (!currentBlock) continue;

            // Get caret position for dropdown positioning
            const caretRect = getCaretRectFromSlate(slate);
            if (!caretRect) continue;

            // Open dropdown immediately (before : is inserted by Slate default behavior)
            editor.emoji.open({
              trigger,
              targetRect: caretRect,
              triggerRange: {
                blockId: currentBlock.id,
                path: slate.selection.anchor.path,
                startOffset: cursorOffset,
              },
            });

            // Don't prevent default — let the : character be inserted
            return;
          }
        }
      }

      // Handle keys when dropdown is open
      if (emojiState.isOpen) {
        const { key } = event;

        // Enter selects the current item — prevent default so the editor
        // doesn't create a new block. The actual selection is handled by
        // the useEmojiDropdown hook's document keydown listener.
        if (options.hotkeys.isEnter(event)) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        // Arrow keys navigate the dropdown — prevent default so the editor
        // doesn't move the cursor or scroll.
        if (options.hotkeys.isArrowUp(event) || options.hotkeys.isArrowDown(event)) {
          event.preventDefault();
          return;
        }

        // Escape closes dropdown
        if (options.hotkeys.isEscape(event) && pluginOptions?.closeOnEscape !== false) {
          event.preventDefault();
          editor.emoji.close('escape');
          return;
        }

        // Backspace updates query
        if (options.hotkeys.isBackspace(event)) {
          const newQuery = emojiState.query.slice(0, -1);

          // If query becomes empty and we backspace again, close
          if (emojiState.query.length === 0) {
            editor.emoji.close('backspace');
            return;
          }

          editor.emoji.setQuery(newQuery);
          return;
        }

        // Regular characters add to query
        if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const currentTrigger = emojiState.trigger;

          // Space closes the dropdown (emoji shortcodes don't have spaces)
          if (key === ' ' && !currentTrigger?.allowSpaces) {
            editor.emoji.close('manual');
            return;
          }

          // If user types another : while dropdown is open, try to auto-select
          // e.g., :smile: — second : selects the current top match
          if (currentTrigger && key === currentTrigger.char) {
            // Don't add trigger char to query
            return;
          }

          editor.emoji.setQuery(emojiState.query + key);
        }
      }
    },
  },
});

export { Emoji };
