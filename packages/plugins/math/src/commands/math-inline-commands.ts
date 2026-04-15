import type { SlateEditor, YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, generateId } from '@yoopta/editor';
import { Editor, Element, Range, Transforms } from 'slate';

import type { MathInlineElement, MathYooEditor } from '../types';

function getMathEditor(editor: YooEditor): MathYooEditor {
  return editor as MathYooEditor;
}

type BuildOptions = {
  props: { latex: string };
};

type InsertOptions = {
  slate: SlateEditor;
  focus?: boolean;
};

type FindOptions = {
  blockId?: string;
  at?: YooptaPathIndex;
};

export type MathInlineCommandsType = {
  buildMathInlineElement: (editor: YooEditor, options: BuildOptions) => MathInlineElement;
  insertMathInline: (editor: YooEditor, latex: string, options: InsertOptions) => void;
  findMathInlineElements: (editor: YooEditor, options?: FindOptions) => MathInlineElement[];
  updateMathInline: (
    editor: YooEditor,
    elementId: string,
    latex: string,
    options?: FindOptions,
  ) => void;
  deleteMathInline: (editor: YooEditor, elementId: string, options?: FindOptions) => void;
  openEditor: (
    editor: YooEditor,
    params: {
      element?: MathInlineElement | null;
      blockId: string | null;
      anchorEl: HTMLElement | null;
    },
  ) => void;
  closeEditor: (editor: YooEditor) => void;
};

export const MathInlineCommands: MathInlineCommandsType = {
  buildMathInlineElement: (_editor, options) => ({
    id: generateId(),
    type: 'math-inline',
    children: [{ text: '' }],
    props: {
      latex: options.props.latex,
      nodeType: 'inlineVoid',
    },
  } as MathInlineElement),

  insertMathInline: (editor, latex, options) => {
    const { slate } = options;
    if (!slate || !slate.selection) return;

    if (!Range.isCollapsed(slate.selection)) {
      Transforms.delete(slate);
    }

    const mathNode: MathInlineElement = {
      id: generateId(),
      type: 'math-inline',
      children: [{ text: '' }],
      props: {
        latex,
        nodeType: 'inlineVoid',
      },
    };

    Transforms.insertNodes(slate, mathNode);
    Transforms.move(slate, { distance: 1 });

    if (options.focus) {
      const blockId = Object.keys(editor.children).find((id) => {
        const block = editor.children[id];
        return block?.meta.order === editor.path.current;
      });
      if (blockId) editor.focusBlock(blockId);
    }
  },

  findMathInlineElements: (editor, options = {}) => {
    try {
      const blockToFind = options.blockId
        ? { id: options.blockId }
        : { at: options.at ?? editor.path.current };

      const slateEditor = Blocks.getBlockSlate(editor, blockToFind);
      if (!slateEditor) return [];

      const elements: MathInlineElement[] = [];

      for (const [node] of Editor.nodes(slateEditor, {
        at: [],
        match: (n): n is MathInlineElement =>
          Element.isElement(n) && !Editor.isEditor(n) && n.type === 'math-inline',
      })) {
        elements.push(node);
      }

      return elements;
    } catch {
      return [];
    }
  },

  updateMathInline: (editor, elementId, latex, options = {}) => {
    const blockToFind = options.blockId
      ? { id: options.blockId }
      : { at: options.at ?? editor.path.current };

    const slateEditor = Blocks.getBlockSlate(editor, blockToFind);
    if (!slateEditor) return;

    const entries = Array.from(
      Editor.nodes(slateEditor, {
        at: [],
        match: (n): n is MathInlineElement =>
          Element.isElement(n) && !Editor.isEditor(n) && n.type === 'math-inline' && n.id === elementId,
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
            nodeType: 'inlineVoid',
          },
        } as Partial<MathInlineElement>,
        { at: path },
      );
    }
  },

  deleteMathInline: (editor, elementId, options = {}) => {
    const blockToFind = options.blockId
      ? { id: options.blockId }
      : { at: options.at ?? editor.path.current };

    const slateEditor = Blocks.getBlockSlate(editor, blockToFind);
    if (!slateEditor) return;

    const entries = Array.from(
      Editor.nodes(slateEditor, {
        at: [],
        match: (n): n is MathInlineElement =>
          Element.isElement(n) && !Editor.isEditor(n) && n.type === 'math-inline' && n.id === elementId,
      }),
    );

    const firstEntry = entries[0];
    if (firstEntry) {
      const [, path] = firstEntry;
      Transforms.removeNodes(slateEditor, { at: path });
    }
  },

  openEditor: (editor, params) => {
    getMathEditor(editor).math.open(params);
  },

  closeEditor: (editor) => {
    getMathEditor(editor).math.close();
  },
};
