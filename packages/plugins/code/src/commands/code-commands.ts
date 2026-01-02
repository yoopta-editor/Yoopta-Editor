import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, Elements, buildBlockData, generateId } from '@yoopta/editor';
// import parserBabel from 'prettier/plugins/babel';
// import estreeParser from 'prettier/plugins/estree';
// import prettier from 'prettier/standalone';

import type { CodeElement, CodeElementProps } from '../types';
import { PLUGIN_LOADERS, PRETTIER_PARSER_MAP } from '../utils/prettier';

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
  prettifyCode: (code: string, language: string) => Promise<string>;
};

export const CodeCommands: CodeCommands = {
  buildCodeElements: (editor: YooEditor, options = {}) => ({
    id: generateId(),
    type: 'code',
    children: [{ text: options?.text || '', props: options?.props }],
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
  // TODO: Implement this
  prettifyCode: async (code: string, language: string) => {
    // const loader = PLUGIN_LOADERS[language];
    // if (!loader) {
    //   console.warn(`No formatter available for: ${language}`);
    //   return code;
    // }
    // try {
    //   // Dynamically import Prettier core and specific plugins in parallel
    //   const [prettier, plugins] = await Promise.all([import('prettier/standalone'), loader()]);
    //   return await prettier.format(code, {
    //     parser: PRETTIER_PARSER_MAP[language],
    //     plugins: plugins.map((p) => p.default || p), // Handle ESM default exports
    //     printWidth: 120,
    //     semi: true,
    //   });
    // } catch (err) {
    //   console.error('Formatting error:', err);
    //   return code;
    // }
  },
};
