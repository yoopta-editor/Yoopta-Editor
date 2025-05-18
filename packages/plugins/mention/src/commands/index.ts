import { generateId, SlateEditor, YooEditor } from '@yoopta/editor';
import { Editor, Element, Location, Span, Transforms } from 'slate';
import { MentionElement, MentionElementProps } from '../types';

type MentionElementOptions = {
  props: Omit<MentionElementProps, 'nodeType'>;
};

type MentionInsertOptions = MentionElementOptions & {
  selection?: Location | undefined;
  slate: SlateEditor;
};

type DeleteElementOptions = {
  slate: SlateEditor;
};

export type MentionCommands = {
  buildMentionElements: (editor: YooEditor, options: MentionElementOptions) => MentionElement;
  insertMention: (editor: YooEditor, options: MentionInsertOptions) => void;
  deleteMention: (editor: YooEditor, options: DeleteElementOptions) => void;
};

export const MentionCommands: MentionCommands = {
  buildMentionElements: (editor, options) => {
    const { props } = options || {};
    const mentionProps: MentionElementProps = { ...props, nodeType: 'inline' };
    return {
      id: generateId(),
      type: 'mention',
      children: [{ text: props?.title || props?.url || '' }],
      props: mentionProps,
    } as MentionElement;
  },
  insertMention: (editor, options) => {
    let { props, slate } = options || {};

    if (!slate || !slate.selection) return;

    const textInSelection = Editor.string(slate, slate.selection);

    const mentionProps = {
      ...props,
      title: props.title || textInSelection || props.url || '',
      nodeType: 'inline',
    } as MentionElementProps;

    const mentionElement = MentionCommands.buildMentionElements(editor, { props });

    const [mentionNodeEntry] = Editor.nodes<MentionElement>(slate, {
      at: slate.selection,
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'mention',
    });

    if (mentionNodeEntry) {
      const [mention, path] = mentionNodeEntry;

      Transforms.setNodes(
        slate,
        { props: { ...mention?.props, ...mentionProps, nodeType: 'inline' } },
        {
          match: (n) => Element.isElement(n) && n.type === 'mention',
          at: path,
        },
      );

      Editor.insertText(slate, mentionProps.title || mentionProps.url || '', { at: slate.selection });
      Transforms.collapse(slate, { edge: 'end' });
      return;
    }

    Transforms.wrapNodes(slate, mentionElement, { split: true, at: slate.selection });
    Transforms.setNodes(
      slate,
      { text: props?.title || props?.url || '' },
      {
        at: slate.selection,
        mode: 'lowest',
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'mention',
      },
    );

    Editor.insertText(slate, props?.title || props?.url || '', { at: slate.selection });
    Transforms.collapse(slate, { edge: 'end' });
  },
  deleteMention: (editor, options) => {
    try {
      const { slate } = options;
      if (!slate || !slate.selection) return;

      const [mentionNodeEntry] = Editor.nodes(slate, {
        at: slate.selection,
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'mention',
      });

      if (mentionNodeEntry) {
        Transforms.unwrapNodes(slate, {
          match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'mention',
          at: slate.selection,
        });
      }
    } catch (error) {}
  },
};
