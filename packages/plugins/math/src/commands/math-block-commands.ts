import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, Elements, generateId } from '@yoopta/editor';
import { Editor, Element, Transforms } from 'slate';

import type { MathBlockElement, MathYooEditor } from '../types';

function getMathEditor(editor: YooEditor): MathYooEditor {
  return editor as MathYooEditor;
}

type FindOptions = {
  blockId?: string;
  at?: YooptaPathIndex;
};

export type MathBlockCommandsType = {
  buildMathBlockElement: (
    editor: YooEditor,
    options: { props: { latex: string } },
  ) => MathBlockElement;
  updateMathBlock: (editor: YooEditor, blockId: string, latex: string) => void;
  getMathBlockElement: (editor: YooEditor, options?: FindOptions) => MathBlockElement | null;
  openEditor: (
    editor: YooEditor,
    params: {
      element?: MathBlockElement | null;
      blockId: string | null;
      anchorEl: HTMLElement | null;
    },
  ) => void;
  closeEditor: (editor: YooEditor) => void;
};

export const MathBlockCommands: MathBlockCommandsType = {
  buildMathBlockElement: (_editor, options) => ({
    id: generateId(),
    type: 'math-block',
    children: [{ text: '' }],
    props: {
      latex: options.props.latex,
      nodeType: 'void',
    },
  } as MathBlockElement),

  updateMathBlock: (editor, blockId, latex) => {
    const slateEditor = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slateEditor) return;

    const entries = Array.from(
      Editor.nodes(slateEditor, {
        at: [],
        match: (n): n is MathBlockElement =>
          Element.isElement(n) && !Editor.isEditor(n) && n.type === 'math-block',
      }),
    );

    const firstEntry = entries[0];
    if (firstEntry) {
      const [node, path] = firstEntry;
      Transforms.setNodes(
        slateEditor,
        {
          props: {
            ...node.props,
            latex,
            nodeType: 'void',
          },
        } as Partial<MathBlockElement>,
        { at: path },
      );
    }
  },

  getMathBlockElement: (editor, options = {}) => {
    try {
      const blockToFind = options.blockId
        ? { id: options.blockId }
        : { at: options.at ?? editor.path.current };

      const slateEditor = Blocks.getBlockSlate(editor, blockToFind);
      if (!slateEditor) return null;

      for (const [node] of Editor.nodes(slateEditor, {
        at: [],
        match: (n): n is MathBlockElement =>
          Element.isElement(n) && !Editor.isEditor(n) && n.type === 'math-block',
      })) {
        return node;
      }

      return null;
    } catch {
      return null;
    }
  },

  openEditor: (editor, params) => {
    getMathEditor(editor).math.open(params);
  },

  closeEditor: (editor) => {
    getMathEditor(editor).math.close();
  },
};
