import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { YooptaEditor } from './YooptaEditor';
import { YooptaEditorProvider } from './YooptaEditorProvider';
import { Editor } from './components/Editor/Editor';
import { YooptaPlugin } from './plugins';
import { SlateElement, YooptaContentValue } from './editor/types';
import { createYooptaEditor } from './editor';
import { useYooptaEditor } from './contexts/YooptaContext/YooptaContext';

const MockPlugin = new YooptaPlugin<{ mockPlugin: SlateElement<'mockPlugin'> }>({
  type: 'MockPlugin',
  elements: {
    mockPlugin: {
      render: () => <div>Mock Plugin</div>,
    },
  },
});

const initialValue: YooptaContentValue = {
  '9d98408d-b990-4ffc-a1d7-387084291b00': {
    id: '9d98408d-b990-4ffc-a1d7-387084291b00',
    value: [
      {
        id: '0508777e-52a4-4168-87a0-bc7661e57aab',
        type: 'paragraph',
        children: [
          {
            text: 'Hello, Yoopta!',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'Paragraph',
    meta: {
      order: 0,
      depth: 0,
    },
  },
};

describe('YooptaEditor', () => {
  it('renders yoopta editor', () => {
    const { container } = render(
      <YooptaEditor value={initialValue} editor={createYooptaEditor()} plugins={[MockPlugin]} />,
    );

    const editor = container.querySelector('.yoopta-editor');
    expect(editor).toBeInTheDocument();
  });
});

describe('YooptaEditorProvider', () => {
  it('renders when editor is nested', () => {
    const { container } = render(
      <YooptaEditorProvider editor={createYooptaEditor()} plugins={[MockPlugin]}>
        <div>
          <p>Sibling to editor</p>
          <Editor>
            <div>Hello</div>
          </Editor>
        </div>
      </YooptaEditorProvider>,
    );

    const editor = container.querySelector('.yoopta-editor');
    expect(editor).toBeInTheDocument();
  });

  it('editor data can be accessed outside of editor', () => {
    const TestApplication = () => {
      // Example accessing editor data outside of editor
      const editor = useYooptaEditor();
      const numberOfBlocks = Object.keys(editor.children).length;
      expect(numberOfBlocks).toBe(1);
      return (
        <div>
          <p>{`This editor has ${numberOfBlocks} block`}</p>
          <Editor>
            <div>Hello, Yoopta!</div>
          </Editor>
        </div>
      );
    };

    const { container } = render(
      <YooptaEditorProvider editor={createYooptaEditor()} plugins={[MockPlugin]}>
        <TestApplication />
      </YooptaEditorProvider>,
    );

    const editor = container.querySelector('.yoopta-editor');
    expect(editor).toBeInTheDocument();
  });
});
