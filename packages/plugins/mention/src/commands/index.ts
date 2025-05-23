import { Blocks, generateId, SlateEditor, YooEditor } from '@yoopta/editor';
import { Editor, Element, Location, Node, Span, Text, Transforms } from 'slate';
import { MentionElement, MentionElementProps, MentionUser } from '../types';

type MentionElementOptions = {
  props: Omit<MentionElementProps, 'nodeType'>;
};

type MentionInsertOptions = MentionElementOptions & {
  selection?: Location | undefined;
  slate?: SlateEditor;
};

type DeleteElementOptions = {
  slate: SlateEditor;
};

export type MentionCommands = {
  buildMentionElements: (editor: YooEditor, options: MentionElementOptions) => MentionElement;
  getSearchQuery: (editor: YooEditor) => string;
  closeDropdown: (editor: YooEditor) => void;
  insertMention: (editor: YooEditor, options: MentionInsertOptions) => void;
  deleteMention: (editor: YooEditor, options: DeleteElementOptions) => void;
};

export const MentionCommands: MentionCommands = {
  buildMentionElements: (editor, options) => {
    const { props } = options || {};
    const mentionProps: MentionElementProps = { ...props, nodeType: 'inlineVoid' };
    return {
      id: generateId(),
      type: 'mention',
      children: [{ text: '' }],
      props: mentionProps,
    } as MentionElement;
  },
  getSearchQuery: (editor) => {
    return editor.mentions.search;
  },
  closeDropdown: (editor) => {
    if (editor.mentions) {
      editor.mentions.target = null;
      editor.mentions.search = '';
    }
  },
  insertMention: (editor, options) => {
    const slateEditor = Blocks.getBlockSlate(editor, { at: editor.path.current });
    if (!slateEditor || !slateEditor.selection) return;

    const { selection } = slateEditor;
    const { anchor } = selection;

    const currentNode = Node.get(slateEditor, anchor.path);
    if (!Text.isText(currentNode)) return;

    const textBefore = currentNode.text.slice(0, anchor.offset);
    const atIndex = textBefore.lastIndexOf('@');

    if (atIndex === -1) return;

    Transforms.select(slateEditor, {
      anchor: { path: anchor.path, offset: atIndex },
      focus: anchor,
    });

    Transforms.delete(slateEditor);

    const mentionNode = {
      type: 'mention',
      children: [{ text: '' }],
      props: {
        ...options.props,
        nodeType: 'inlineVoid',
      },
    };

    Transforms.insertNodes(slateEditor, mentionNode);
    Transforms.insertText(slateEditor, ' ');

    editor.mentions.target = null;
    editor.mentions.search = '';
  },
  deleteMention: (editor, options) => {},
};
