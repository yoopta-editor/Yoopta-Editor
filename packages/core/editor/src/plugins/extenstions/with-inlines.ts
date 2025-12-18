import { Editor, Range, Element as SlateElement, Transforms } from 'slate';
import isURL from 'validator/lib/isURL';

import type { SlateEditor, YooEditor } from '../../editor/types';

function isUrl(string: string): boolean {
  if (!string || string.length > 2048) return false;

  return isURL(string, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
    require_host: true,
    require_port: false,
    allow_protocol_relative_urls: false,
    allow_fragments: true,
    allow_query_components: true,
    allow_underscores: true,
    disallow_auth: false,
  });
}

const isLinkActive = (slate) => {
  const [link] = Editor.nodes(slate, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
  return !!link;
};

const removeLink = (slate) => {
  Transforms.unwrapNodes(slate, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
};

const addLink = (editor: YooEditor, slate: SlateEditor, url: string) => {
  if (isLinkActive(slate)) {
    removeLink(slate);
  }

  const { selection } = slate;
  const isCollapsed = selection && Range.isCollapsed(selection);

  // Should be moved to the Link plugin
  const defaultLinkProps: Record<string, unknown> | undefined =
    editor.plugins?.Link?.elements?.link?.props;

  const link = {
    type: 'link',
    children: isCollapsed ? [{ text: url }] : [],
    props: {
      url,
      target: defaultLinkProps?.target || '_self',
      rel: defaultLinkProps?.rel || 'noopener noreferrer',
    },
  } as SlateElement;

  if (isCollapsed) {
    Transforms.insertNodes(slate, link);
  } else {
    Transforms.wrapNodes(slate, link, { split: true });
    Transforms.collapse(slate, { edge: 'end' });
  }
};

export const withInlines = (editor: YooEditor, slate: SlateEditor) => {
  const { insertData, insertText } = slate;

  slate.insertText = (text) => {
    if (text && isUrl(text)) {
      addLink(editor, slate, text);
    } else {
      insertText(text);
    }
  };

  slate.insertData = (data) => {
    const text = data.getData('text/plain');
    if (text && isUrl(text)) {
      addLink(editor, slate, text);
    } else {
      insertData(data);
    }
  };

  return slate;
};
