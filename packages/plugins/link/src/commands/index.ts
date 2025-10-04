import type { SlateEditor, YooEditor } from '@yoopta/editor';
import { generateId } from '@yoopta/editor';
import type { Location} from 'slate';
import { Editor, Element, Span, Transforms } from 'slate';

import type { LinkElement, LinkElementProps } from '../types';

type LinkElementOptions = {
  props: Omit<LinkElementProps, 'nodeType'>;
};

type LinkInsertOptions = LinkElementOptions & {
  selection?: Location | undefined;
  slate: SlateEditor;
};

type DeleteElementOptions = {
  slate: SlateEditor;
};

export type LinkCommands = {
  buildLinkElements: (editor: YooEditor, options: LinkElementOptions) => LinkElement;
  insertLink: (editor: YooEditor, options: LinkInsertOptions) => void;
  deleteLink: (editor: YooEditor, options: DeleteElementOptions) => void;
};

export const LinkCommands: LinkCommands = {
  buildLinkElements: (editor, options) => {
    const { props } = options || {};
    const linkProps: LinkElementProps = { ...props, nodeType: 'inline' };
    return {
      id: generateId(),
      type: 'link',
      children: [{ text: props?.title || props?.url || '' }],
      props: linkProps,
    } as LinkElement;
  },
  insertLink: (editor, options) => {
    const { props, slate } = options || {};

    if (!slate || !slate.selection) return;

    const textInSelection = Editor.string(slate, slate.selection);

    const linkProps = {
      ...props,
      title: props.title || textInSelection || props.url || '',
      nodeType: 'inline',
    } as LinkElementProps;

    const linkElement = LinkCommands.buildLinkElements(editor, { props });

    const [linkNodeEntry] = Editor.nodes<LinkElement>(slate, {
      at: slate.selection,
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    });

    if (linkNodeEntry) {
      const [link, path] = linkNodeEntry;

      Transforms.setNodes(
        slate,
        { props: { ...link?.props, ...linkProps, nodeType: 'inline' } },
        {
          match: (n) => Element.isElement(n) && n.type === 'link',
          at: path,
        },
      );

      Editor.insertText(slate, linkProps.title || linkProps.url || '', { at: slate.selection });
      Transforms.collapse(slate, { edge: 'end' });
      return;
    }

    Transforms.wrapNodes(slate, linkElement, { split: true, at: slate.selection });
    Transforms.setNodes(
      slate,
      { text: props?.title || props?.url || '' },
      {
        at: slate.selection,
        mode: 'lowest',
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
      },
    );

    Editor.insertText(slate, props?.title || props?.url || '', { at: slate.selection });
    Transforms.collapse(slate, { edge: 'end' });
  },
  deleteLink: (editor, options) => {
    try {
      const { slate } = options;
      if (!slate || !slate.selection) return;

      const [linkNodeEntry] = Editor.nodes(slate, {
        at: slate.selection,
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
      });

      if (linkNodeEntry) {
        Transforms.unwrapNodes(slate, {
          match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
          at: slate.selection,
        });
      }
    } catch (error) {}
  },
};
