import {
  Blocks,
  buildBlockData,
  Elements,
  generateId,
  YooEditor,
  YooptaPathIndex,
} from '@yoopta/editor';
import { DividerElement, DividerElementProps } from '../types';

type DividerInsertOptions = DividerElementProps & {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type DividerCommands = {
  buildDividerElements: (
    editor: YooEditor,
    options?: Partial<DividerElementProps>,
  ) => DividerElement;
  insertDivider: (editor: YooEditor, options?: Partial<DividerInsertOptions>) => void;
  deleteDivider: (editor: YooEditor, blockId: string) => void;
  updateDivider: (editor: YooEditor, blockId: string, props: Partial<DividerElementProps>) => void;
};

export const DividerCommands: DividerCommands = {
  buildDividerElements: (editor, options = {}) => {
    return {
      id: generateId(),
      type: 'divider',
      children: [{ text: '' }],
      props: {
        color: options.color || '#EFEFEE',
        theme: options.theme || 'solid',
        nodeType: 'void',
      },
    };
  },
  insertDivider: (editor, options = {}) => {
    const { at, focus } = options;

    const dividerElement = DividerCommands.buildDividerElements(editor);
    const block = buildBlockData({ value: [dividerElement], type: 'Divider' });
    Blocks.insertBlock(editor, block.type, { at, focus, blockData: block });
  },
  deleteDivider: (editor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
  updateDivider: (editor: YooEditor, blockId: string, props) => {
    Elements.updateElement(editor, blockId, {
      type: 'divider',
      props: {
        ...props,
      },
    });
  },
};
