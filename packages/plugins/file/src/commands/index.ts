import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, Elements, buildBlockData, generateId } from '@yoopta/editor';

import type { FileElement, FileElementProps } from '../types';

type FileElementOptions = {
  props?: Omit<FileElementProps, 'nodeType'>;
};

type InsertFileOptions = FileElementOptions & {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type FileCommands = {
  buildFileElements: (editor: YooEditor, options?: Partial<FileElementOptions>) => FileElement;
  insertFile: (editor: YooEditor, options?: Partial<InsertFileOptions>) => void;
  deleteFile: (editor: YooEditor, blockId: string) => void;
  updateFile: (editor: YooEditor, blockId: string, props: Partial<FileElementProps>) => void;
};

export const FileCommands: FileCommands = {
  buildFileElements: (editor: YooEditor, options = {}) => {
    const fileProps = { ...options.props, nodeType: 'void' };
    return {
      id: generateId(),
      type: 'file',
      children: [{ text: '' }],
      props: fileProps as FileElementProps,
    };
  },
  insertFile: (editor: YooEditor, options = {}) => {
    const { at, focus, props } = options;
    const file = FileCommands.buildFileElements(editor, { props });
    const block = buildBlockData({ value: [file], type: 'File' });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },
  deleteFile: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
  updateFile: (editor: YooEditor, blockId, props) => {
    Elements.updateElement(editor, { blockId, type: 'file', props });
  },
};
