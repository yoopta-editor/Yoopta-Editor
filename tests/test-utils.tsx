import { render } from '@testing-library/react';
import React from 'react';
import { createYooptaEditor } from '../packages/core/editor/src/editor';
import { YooptaEditor, YooptaEditorProps } from '../packages/core/editor/src/YooptaEditor';
import { TEST_PLUGIN_LIST } from './test-plugins';
import { YooptaContentValue } from '../packages/core/editor/src/editor/types';

const DEFAULT_EDITOR_STATE = {
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
          },
          {
            text: ' ',
            italic: true,
            bold: true,
          },
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
              },
            ],
          },
          {
            text: '.',
            italic: true,
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 1,
    },
  },
} as YooptaContentValue;

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
