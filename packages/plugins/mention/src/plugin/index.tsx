import { Blocks, Elements, YooptaPlugin } from '@yoopta/editor';
import { Range } from 'slate';
import { MentionCommands } from '../commands';
import { MentionElementMap } from '../types';
import { MentionRender } from '../ui/MentionRender';

const Mention = new YooptaPlugin<MentionElementMap>({
  type: 'MentionPlugin',
  elements: {
    mention: {
      render: MentionRender,
      props: {
        user: {
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
  },
  commands: MentionCommands,
  extensions: (slate, editor) => {
    const { markableVoid, isInline } = slate;

    slate.markableVoid = (element) => element.type === 'mention' || markableVoid(element);
    slate.isInline = (element) => element.type === 'mention' || isInline(element);

    return slate;
  },
  events: {
    onKeyDown: (editor, slate, options) => (event) => {
      const { key } = event;

      if (key === '@') {
        if (slate.selection && Range.isCollapsed(slate.selection)) {
          const slateEditor = Blocks.getBlockSlate(editor, { at: editor.path.current });
          if (!slateEditor || !slateEditor.selection) return;
          const domRange = Elements.getElementRect(editor, slateEditor);
          if (!domRange) return;

          editor.mentions.target = {
            top: domRange.top + window.scrollY,
            left: domRange.left + window.scrollX,
            width: domRange.width,
            height: domRange.height,
          };
          editor.mentions.search = '';
        }
      }

      if (editor.mentions.target) {
        if (key === 'Escape') {
          editor.mentions.target = null;
          editor.mentions.search = '';
        } else if (key === 'Backspace') {
          editor.mentions.search = editor.mentions.search.slice(0, -1);
        } else if (key.length === 1) {
          editor.mentions.search += key;
        }
      }
    },
  },
});

export { Mention };
