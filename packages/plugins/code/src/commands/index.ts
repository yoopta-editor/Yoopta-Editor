import { Blocks, buildBlockData, generateId, YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { CodeElement, CodeElementProps } from '../types';

type CodeElementOptions = {
  text?: string;
  props?: CodeElementProps;
};

type InsertCodeOptions = CodeElementOptions & {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type CodeCommands = {
  buildCodeElements: (editor: YooEditor, options?: Partial<CodeElementOptions>) => CodeElement;
  insertCode: (editor: YooEditor, options?: Partial<InsertCodeOptions>) => void;
  deleteCode: (editor: YooEditor, blockId: string) => void;
  updateCodeTheme: (editor: YooEditor, blockId: string, theme: CodeElementProps['theme']) => void;
  updateCodeLanguage: (
    editor: YooEditor,
    blockId: string,
    language: CodeElementProps['language'],
  ) => void;
};

export const CodeCommands: CodeCommands = {
  buildCodeElements: (editor: YooEditor, options = {}) => {
    return {
      id: generateId(),
      type: 'code',
      children: [{ text: options?.text || '', props: options?.props }],
    };
  },
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
    Blocks.updateBlock(editor, blockId, {
      value: [{ ...element, props: { ...element.props, theme } }],
    });
  },
  updateCodeLanguage: (editor: YooEditor, blockId, language) => {
    const block = editor.children[blockId];
    const element = block.value[0] as CodeElement;
    Blocks.updateBlock(editor, blockId, {
      value: [{ ...element, props: { ...element.props, language } }],
    });
  },
};
