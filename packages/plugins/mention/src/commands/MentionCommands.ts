import { Blocks, generateId, SlateEditor, SlateElement, YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Editor, Element, Location, Node, NodeEntry, Range, Text, Transforms } from 'slate';
import { MentionElement, MentionElementProps, MentionPluginOptions } from '../types';

type MentionElementOptions = {
  props: Omit<MentionElementProps, 'nodeType'>;
};

type MentionInsertOptions = {
  selection?: Location | undefined;
};

type DeleteElementOptions = {
  selection?: Location | undefined;
};

type FindMentionOptions = { blockId: string } | { at: YooptaPathIndex };

export type MentionCommands = {
  buildMentionElements: (editor: YooEditor, options: MentionElementOptions) => MentionElement;
  getSearchQuery: (editor: YooEditor) => string;
  closeDropdown: (editor: YooEditor) => void;
  insertMention: (editor: YooEditor, props: MentionElementOptions['props'], options: MentionInsertOptions) => void;
  deleteMention: (editor: YooEditor, options: DeleteElementOptions) => void;
  openDropdown: (editor: YooEditor, target: { domRect: DOMRect; clientRect: DOMRectList }, search: string) => void;
  findMention: (editor: YooEditor, options?: FindMentionOptions) => NodeEntry<MentionElement> | null;
  findMentions: (editor: YooEditor, options?: FindMentionOptions) => NodeEntry<MentionElement>[] | null;
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

  insertMention: (editor, props, options) => {
    const { char = '@' } = (editor.plugins.Mention.options as MentionPluginOptions) || {};
    const slateEditor = Blocks.getBlockSlate(editor, { at: editor.path.current });
    const range = options?.selection || slateEditor?.selection;
    if (!slateEditor || !Range.isRange(range)) return;

    const { anchor } = range;

    const currentNode = Node.get(slateEditor, anchor.path);
    if (!Text.isText(currentNode)) return;

    const textBefore = currentNode.text.slice(0, anchor.offset);
    const atIndex = textBefore.lastIndexOf(char);

    if (atIndex === -1) return;

    Transforms.select(slateEditor, {
      anchor: { path: anchor.path, offset: atIndex },
      focus: anchor,
    });

    Transforms.delete(slateEditor);

    const mentionNode: MentionElement = {
      id: generateId(),
      type: 'mention',
      children: [{ text: '' }],
      props: {
        ...props,
        nodeType: 'inlineVoid',
      },
    };

    const block = Blocks.getBlock(editor, { at: editor.path.current });

    if (block?.id) {
      editor.focusBlock(block?.id);
    }

    Transforms.insertNodes(slateEditor, mentionNode);
  },
  deleteMention: (editor, options) => {
    const slateEditor = Blocks.getBlockSlate(editor, { at: editor.path.current });
    const range = options?.selection || slateEditor?.selection;

    if (!slateEditor || !Range.isRange(range)) return;

    const node = Node.get(slateEditor, range.anchor.path);
    if (!Element.isElement(node) || !node || !Editor.isInline(slateEditor, node)) return;

    Transforms.removeNodes(slateEditor, { at: range.anchor.path });
  },
  findMentions: (editor: YooEditor, options?: FindMentionOptions): NodeEntry<MentionElement>[] | null => {
    try {
      let blockToFind = { id: options?.blockId };
      if (!blockToFind.id) {
        blockToFind = { at: typeof options?.at === 'number' ? options?.at : editor.path.current };
      }

      const slateEditor = Blocks.getBlockSlate(editor, blockToFind);
      if (!slateEditor) return [];

      const mentions = Array.from(
        Editor.nodes(slateEditor, {
          at: [],
          match: (n): n is MentionElement => Element.isElement(n) && !Editor.isEditor(n) && n.type === 'mention',
        }),
      );

      return mentions;
    } catch (error) {
      console.error('Error finding mentions:', error);
      return null;
    }
  },
  findMention: (editor: YooEditor, options?: FindMentionOptions): NodeEntry<MentionElement> | null => {
    try {
      let blockToFind = { id: options?.blockId };
      if (!blockToFind.id) {
        blockToFind = { at: typeof options?.at === 'number' ? options?.at : editor.path.current };
      }

      const slateEditor = Blocks.getBlockSlate(editor, blockToFind);
      if (!slateEditor) return null;

      const [mention] = Editor.nodes(slateEditor, {
        match: (n): n is MentionElement => Element.isElement(n) && !Editor.isEditor(n) && n.type === 'mention',
        mode: 'highest',
        at: [],
      });

      return mention || null;
    } catch (error) {
      console.error('Error finding mention:', error);
      return null;
    }
  },
  openDropdown: (editor, target: { domRect: DOMRect; clientRect: DOMRectList }, search: string) => {
    editor.mentions.target = target;
    editor.mentions.search = search;
  },
  getSearchQuery: (editor) => {
    return editor.mentions.search;
  },
  closeDropdown: (editor) => {
    editor.mentions.target = null;
    editor.mentions.search = '';
  },
};
