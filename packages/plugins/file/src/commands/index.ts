import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, Elements, buildBlockData, generateId } from '@yoopta/editor';

import type { FileElement, FileElementProps } from '../types';

type FileElementOptions = {
  props?: Partial<FileElementProps>;
};

type InsertFileOptions = FileElementOptions & {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type FileCommandsType = {
  buildFileElements: (editor: YooEditor, options?: Partial<FileElementOptions>) => FileElement;
  insertFile: (editor: YooEditor, options?: Partial<InsertFileOptions>) => void;
  deleteFile: (editor: YooEditor, blockId: string) => void;
  updateFile: (editor: YooEditor, blockId: string, props: Partial<FileElementProps>) => void;
};

export const FileCommands: FileCommandsType = {
  buildFileElements: (_editor: YooEditor, options = {}) => {
    const fileProps: FileElementProps = {
      id: options.props?.id ?? null,
      src: options.props?.src ?? null,
      name: options.props?.name ?? null,
      size: options.props?.size ?? null,
      format: options.props?.format ?? null,
    };

    return {
      id: generateId(),
      type: 'file',
      children: [{ text: '' }],
      props: fileProps,
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
