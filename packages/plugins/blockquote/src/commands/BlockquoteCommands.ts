import { Blocks, buildBlockData, generateId, YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { BlockquoteElement } from '../types';

type BlockquoteElementOptions = {
  text?: string;
};

export type InsertBlockquoteOptions = {
  text?: string;
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type BlockquoteCommands = {
  buildBlockquoteElements: (editor: YooEditor, options?: Partial<BlockquoteElementOptions>) => BlockquoteElement;
  insertBlockquote: (editor: YooEditor, options?: Partial<InsertBlockquoteOptions>) => void;
  deleteBlockquote: (editor: YooEditor, blockId: string) => void;
};

export const BlockquoteCommands: BlockquoteCommands = {
  buildBlockquoteElements: (editor, options = {}) => {
    return { id: generateId(), type: 'blockquote', children: [{ text: options?.text || '' }] };
  },
  insertBlockquote: (editor, options = {}) => {
    const { at, focus, text } = options;

    const blockquote = BlockquoteCommands.buildBlockquoteElements(editor, { text });
    const block = buildBlockData({ value: [blockquote], type: 'Blockquote' });
    // [TEST]
    Blocks.insertBlock(editor, block.type, { at, focus, blockData: block });
  },
  deleteBlockquote: (editor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};
