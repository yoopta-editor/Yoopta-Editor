import { render } from '@testing-library/react';
import React from 'react';
import { createYooptaEditor } from '../packages/core/editor/src/editor';
import { YooptaPlugin } from '../packages/core/editor/src/plugins';
import { YooptaEditor, YooptaEditorProps } from '../packages/core/editor/src/YooptaEditor';
import { Editor, Element, Transforms, Node, Descendant } from 'slate';
import {
  YooEditor,
  SlateEditor,
  YooptaContentValue,
  YooptaBlockData,
  SlateElement,
} from '@yoopta/editor';
import { vi } from 'vitest';

export const InlinePlugin = new YooptaPlugin({
  type: 'Inline',
  elements: {
    inline: {
      render: (props) => <span {...props.attributes}>{props.children}</span>,
      props: { nodeType: 'inline' },
    },
  },
});

export const DefaultParagraph = new YooptaPlugin({
  type: 'Paragraph',
  elements: {
    paragraph: {
      render: (props) => <p {...props.attributes}>{props.children}</p>,
      props: { nodeType: 'block' },
    },
  },
  options: {
    shortcuts: ['p', 'text', 'para'],
    display: {
      title: 'Paragraph',
      description: 'Paragraph block',
    },
  },
});

export const BlockPluginWithProps = new YooptaPlugin({
  type: 'BlockPluginWithProps',
  elements: {
    block: {
      render: (props) => <div {...props.attributes}>{props.children}</div>,
      props: { nodeType: 'block', checked: false },
    },
  },
});

const PluginWithSeveralElements = new YooptaPlugin({
  type: 'PluginWithSeveralElements',
  elements: {
    'root-element': {
      render: (props) => <div {...props.attributes}>{props.children}</div>,
      props: { nodeType: 'inline' },
      children: ['first-child-element'],
    },
    'first-child-element': {
      render: (props) => <div {...props.attributes}>{props.children}</div>,
      props: { nodeType: 'block' },
      children: ['second-child-element'],
    },
    'second-child-element': {
      render: (props) => <div {...props.attributes}>{props.children}</div>,
      props: { nodeType: 'block' },
    },
  },
});

export const TEST_PLUGIN_LIST = [
  InlinePlugin,
  DefaultParagraph,
  BlockPluginWithProps,
  PluginWithSeveralElements,
];

const DEFAULT_EDITOR_STATE: YooptaContentValue = {
  'aafd7597-1e9a-4c80-ab6c-88786595d72a': {
    id: 'aafd7597-1e9a-4c80-ab6c-88786595d72a',
    meta: { depth: 0, order: 0 },
    type: 'Paragraph',
    value: [
      {
        id: '3aff9e2c-5fee-43ff-b426-1e4fee8b303c',
        type: 'paragraph',
        props: { nodeType: 'block' },
        children: [{ text: '' }],
      },
    ],
  },
  '7025b887-a746-42dd-9d37-56253dce4e96': {
    id: '7025b887-a746-42dd-9d37-56253dce4e96',
    type: 'Paragraph',
    value: [
      {
        id: 'e46ac801-0bc2-455a-9138-ef5e141e4845',
        type: 'paragraph',
        children: [
          {
            text: 'Read without limits or ads, fund great writers, and join a community that believes in human storytelling with',
            italic: true,
            bold: true,
          } as Descendant,
          {
            text: ' ',
            italic: true,
            bold: true,
          } as Descendant,
          {
            id: '19554e2b-180a-461e-b287-98416f7f30d4',
            type: 'link',
            props: {
              url: 'https://medium.com/membership',
              target: '_blank',
              rel: 'noopener',
              title: 'membership',
              nodeType: 'inline',
            },
            children: [
              {
                bold: true,
                italic: true,
                text: 'membership',
              } as Descendant,
            ],
          },
          {
            text: '.',
            italic: true,
            bold: true,
          } as Descendant,
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left' as const,
      depth: 0,
      order: 1,
    },
  },
};

export function renderYooptaEditor(props: Partial<YooptaEditorProps> = {}) {
  const editor = props.editor || createYooptaEditor();

  return render(
    <YooptaEditor
      {...props}
      value={props.value || DEFAULT_EDITOR_STATE}
      editor={props.editor || editor}
      plugins={props.plugins || TEST_PLUGIN_LIST}
      autoFocus={props.autoFocus || false}
    />,
  );
}

// Slate test utilities
export interface MockSlateEditor extends Partial<SlateEditor> {
  normalizeNode: ReturnType<typeof vi.fn>;
  removeNodes: ReturnType<typeof vi.fn>;
  children: any[];
}

export interface MockYooEditor extends Partial<YooEditor> {
  path: { current: number | null };
  batchOperations: (fn: () => void) => void;
  insertBlock: ReturnType<typeof vi.fn>;
}

export function createMockSlateEditor(): MockSlateEditor {
  return {
    normalizeNode: vi.fn(),
    removeNodes: vi.fn(),
    children: [],
  };
}

export function createMockYooEditor(): MockYooEditor {
  return {
    path: { current: 0 },
    batchOperations: (fn) => fn(),
    insertBlock: vi.fn(),
  };
}

export function setupSlateMocks() {
  // Mock Editor.isEditor
  vi.spyOn(Editor, 'isEditor').mockImplementation((node) => {
    return node && typeof node === 'object' && 'children' in node;
  });

  // Mock Element.isElement
  vi.spyOn(Element, 'isElement').mockImplementation((node) => {
    return node && typeof node === 'object' && 'type' in node;
  });

  // Mock Transforms.removeNodes
  vi.spyOn(Transforms, 'removeNodes').mockImplementation((editor, options) => {
    if (editor.removeNodes) {
      editor.removeNodes(options);
    }
  });
}

export function createTestNode(children: any[]): Node {
  return {
    children,
  } as Node;
}

export function createTestParagraph(text: string) {
  return {
    id: expect.any(String),
    type: 'paragraph',
    children: [{ text }],
  };
}

export function createTestBlockData(value: any[], meta = {}) {
  return {
    id: expect.any(String),
    value,
    meta: {
      align: 'left' as const,
      depth: 0,
      order: 1,
      ...meta,
    },
  };
}
