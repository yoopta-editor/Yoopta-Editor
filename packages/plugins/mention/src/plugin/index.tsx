import { Blocks, Elements, SlateEditor, YooEditor, YooptaPlugin } from '@yoopta/editor';
import { Node, Range, Text } from 'slate';
import { MentionCommands } from '../commands/MentionCommands';
import { MentionElementMap, MentionPluginOptions, MentionItem } from '../types';
import { MentionRender } from '../ui/MentionRender';

const Mention = new YooptaPlugin<MentionElementMap, MentionPluginOptions>({
  type: 'Mention',
  elements: {
    mention: {
      render: MentionRender,
      props: {
        mention: {
          id: '',
          avatar: '',
          name: '',
        },
        nodeType: 'inlineVoid',
      },
    },
  },
  options: {
    display: {
      title: 'Mention',
      description: 'Create mention',
    },
    char: '@',
  },
  // commands: MentionCommands,
  extensions: (slate, editor) => {
    const { markableVoid, isInline } = slate;

    slate.markableVoid = (element) => element.type === 'mention' || markableVoid(element);
    slate.isInline = (element) => element.type === 'mention' || isInline(element);

    return slate;
  },
  events: {
    onKeyDown: (editor, slate) => (event) => {
      const { key } = event;

      console.log(`Mention onKeyDown: ${key}`);

      const pluginOptions = (editor.plugins.Mention.options as MentionPluginOptions) || {};
      const { char } = pluginOptions;

      if (key === char) {
        if (slate.selection && Range.isCollapsed(slate.selection)) {
          const slateEditor = Blocks.getBlockSlate(editor, { at: editor.path.current });
          if (!slateEditor || !slateEditor.selection) return;

          const elRect = Elements.getElementRect(editor, slateEditor);
          if (!elRect) return;

          const currentNode = Node.get(slateEditor, slate.selection.anchor.path);
          if (!Text.isText(currentNode)) return;

          const text = currentNode.text;
          const offset = slate.selection.anchor.offset;

          const charBefore = text[offset - 1] ?? '';
          const charAfter = text[offset] ?? '';

          const isLeftClear = charBefore === '' || /\s/.test(charBefore);
          const isRightClear = charAfter === '' || /\s/.test(charAfter);

          if (!(isLeftClear && isRightClear)) return;

          editor.mentions.target = elRect;
          editor.mentions.search = '';
        }
      }

      if (editor.mentions.target) {
        if (key === 'Escape') {
          MentionCommands.closeDropdown(editor);
        } else if (key === 'Backspace') {
          editor.mentions.search = editor.mentions.search.slice(0, -1);
        } else if (key.length === 1) {
          editor.mentions.search += key;
        }
      }
    },
  },
});

function withMentions(baseEditor: YooEditor): YooEditor {
  baseEditor.mentions = {
    target: null,
    search: '',
  };

  return baseEditor;
}

export { Mention, withMentions };
