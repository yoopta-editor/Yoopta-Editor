import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, Elements, buildBlockData, generateId } from '@yoopta/editor';
import { Editor, Node, Transforms } from 'slate';

import type { CodeElement, CodeElementProps } from '../types';
import { type FormatCodeOptions, formatCode, isLanguageSupported } from '../utils/prettier';

type CodeElementOptions = {
  text?: string;
  props?: CodeElementProps;
};

type InsertCodeOptions = CodeElementOptions & {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type BeautifyCodeResult = {
  success: boolean;
  error?: string;
};

export type CodeCommandsType = {
  buildCodeElements: (editor: YooEditor, options?: Partial<CodeElementOptions>) => CodeElement;
  insertCode: (editor: YooEditor, options?: Partial<InsertCodeOptions>) => void;
  deleteCode: (editor: YooEditor, blockId: string) => void;
  updateCodeTheme: (editor: YooEditor, blockId: string, theme: CodeElementProps['theme']) => void;
  updateCodeLanguage: (
    editor: YooEditor,
    blockId: string,
    language: CodeElementProps['language'],
  ) => void;
  /** Formats the code string and returns the result (does not modify editor) */
  prettifyCode: (
    editor: YooEditor,
    code: string,
    language: string,
    options?: FormatCodeOptions,
  ) => Promise<{ formatted: string; success: boolean; error?: string }>;
  /** Beautifies the code in the specified block (modifies editor content) */
  beautifyCode: (
    editor: YooEditor,
    blockId: string,
    options?: FormatCodeOptions,
  ) => Promise<BeautifyCodeResult>;
  /** Checks if a language supports formatting */
  isLanguageSupported: (language: string) => boolean;
};

export const CodeCommands: CodeCommandsType = {
  buildCodeElements: (_editor: YooEditor, options = {}) => ({
    id: generateId(),
    type: 'code',
    children: [{ text: options?.text ?? '', props: options?.props }],
  }),
  insertCode: (editor: YooEditor, options = {}) => {
    const { at, focus, text, props } = options;
    const code = CodeCommands.buildCodeElements(editor, { text, props });
    const block = buildBlockData({ value: [code], type: 'Code' });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },
  deleteCode: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
  updateCodeTheme: (editor: YooEditor, blockId, theme) => {
    const block = editor.children[blockId];
    const element = block.value[0] as CodeElement;
    Elements.updateElement(editor, {
      blockId,
      type: 'code',
      props: { ...element.props, theme },
    });
  },
  updateCodeLanguage: (editor: YooEditor, blockId, language) => {
    const block = editor.children[blockId];
    const element = block.value[0] as CodeElement;
    Elements.updateElement(editor, {
      blockId,
      type: 'code',
      props: { ...element.props, language },
    });
  },

  prettifyCode: async (_editor, code, language, options) => formatCode(code, language, options),

  beautifyCode: async (editor, blockId, options) => {
    const block = editor.children[blockId];
    if (!block) {
      return { success: false, error: 'Block not found' };
    }

    const element = block.value[0] as CodeElement;
    const language = element.props?.language ?? 'javascript';

    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) {
      return { success: false, error: 'Could not access block slate' };
    }

    // Use Slate's Node.string to properly extract all text content
    const currentCode = Node.string(slate.children[0]);

    if (!currentCode.trim()) {
      return { success: false, error: 'No code to format' };
    }

    const result = await formatCode(currentCode, language, options);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Select all content in the code element and replace it
    const codeElementPath = [0];
    const start = Editor.start(slate, codeElementPath);
    const end = Editor.end(slate, codeElementPath);

    Transforms.select(slate, { anchor: start, focus: end });
    Transforms.delete(slate);
    Transforms.insertText(slate, result.formatted);

    return { success: true };
  },

  isLanguageSupported,
};
