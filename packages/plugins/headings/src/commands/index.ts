import { Blocks, buildBlockData, generateId, YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { HeadingOneElement, HeadingThreeElement, HeadingTwoElement } from '../types';

export type HeadingElementOptions = { text?: string };
export type HeadingInsertOptions = HeadingElementOptions & { at: YooptaPathIndex; focus?: boolean };

export type HeadingOneCommands = {
  buildHeadingOneElements: (
    editor: YooEditor,
    options?: Partial<HeadingElementOptions>,
  ) => HeadingOneElement;
  insertHeadingOne: (editor: YooEditor, options?: Partial<HeadingInsertOptions>) => void;
  deleteHeadingOne: (editor: YooEditor, blockId: string) => void;
};

export const HeadingOneCommands: HeadingOneCommands = {
  buildHeadingOneElements: (editor, options) => {
    return { id: generateId(), type: 'heading-one', children: [{ text: options?.text || '' }] };
  },
  insertHeadingOne: (editor, options = {}) => {
    const { at, focus, text } = options;
    const headingOne = HeadingOneCommands.buildHeadingOneElements(editor, { text });
    const block = buildBlockData({ value: [headingOne], type: 'HeadingOne' });
    Blocks.insertBlock(editor, block.type, { at, focus, blockData: block });
  },
  deleteHeadingOne: (editor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};

export type HeadingTwoCommands = {
  buildHeadingTwoElements: (
    editor: YooEditor,
    options?: Partial<HeadingElementOptions>,
  ) => HeadingTwoElement;
  insertHeadingTwo: (editor: YooEditor, options?: Partial<HeadingInsertOptions>) => void;
  deleteHeadingTwo: (editor: YooEditor, blockId: string) => void;
};

export const HeadingTwoCommands: HeadingTwoCommands = {
  buildHeadingTwoElements: (editor, options) => {
    return { id: generateId(), type: 'heading-two', children: [{ text: options?.text || '' }] };
  },
  insertHeadingTwo: (editor, options = {}) => {
    const { at, focus, text } = options;
    const headingTwo = HeadingTwoCommands.buildHeadingTwoElements(editor, { text });
    const block = buildBlockData({ value: [headingTwo], type: 'HeadingTwo' });
    Blocks.insertBlock(editor, block.type, { at, focus, blockData: block });
  },
  deleteHeadingTwo: (editor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};

export type HeadingThreeCommands = {
  buildHeadingThreeElements: (
    editor: YooEditor,
    options?: Partial<HeadingElementOptions>,
  ) => HeadingThreeElement;
  insertHeadingThree: (editor: YooEditor, options?: Partial<HeadingInsertOptions>) => void;
  deleteHeadingThree: (editor: YooEditor, blockId: string) => void;
};

export const HeadingThreeCommands: HeadingThreeCommands = {
  buildHeadingThreeElements: (editor, options) => {
    return { id: generateId(), type: 'heading-three', children: [{ text: options?.text || '' }] };
  },
  insertHeadingThree: (editor, options = {}) => {
    const { at, focus, text } = options;
    const headingThree = HeadingThreeCommands.buildHeadingThreeElements(editor, { text });
    const block = buildBlockData({ value: [headingThree], type: 'HeadingThree' });
    Blocks.insertBlock(editor, block.type, { at, focus, blockData: block });
  },
  deleteHeadingThree: (editor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};
