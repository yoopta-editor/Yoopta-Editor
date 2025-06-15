import { Blocks, Elements, generateId, YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { VideoElement, VideoElementProps } from '../types';

type VideoElementOptions = {
  props?: Omit<VideoElementProps, 'nodeType'>;
};

type InsertVideoOptions = VideoElementOptions & {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type VideoCommands = {
  buildVideoElements: (editor?: YooEditor, options?: Partial<VideoElementOptions>) => VideoElement;
  insertVideo: (editor: YooEditor, options?: Partial<InsertVideoOptions>) => void;
  deleteVideo: (editor: YooEditor, blockId: string) => void;
  updateVideo: (editor: YooEditor, blockId: string, props: Partial<VideoElementProps>) => void;
};

export const VideoCommands: VideoCommands = {
  buildVideoElements: (editor?: YooEditor, options = {}) => {
    const videoProps = { ...options.props, nodeType: 'void' };
    return { id: generateId(), type: 'video', children: [{ text: '' }], props: videoProps as VideoElementProps };
  },
  insertVideo: (editor: YooEditor, options = {}) => {
    const { at, focus, props } = options;
    const video = VideoCommands.buildVideoElements(editor, { props });
    const block = Blocks.buildBlockData({ value: [video], type: 'Video', meta: { align: 'center', depth: 0 } });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },
  deleteVideo: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
  updateVideo: (editor: YooEditor, blockId, props) => {
    Elements.updateElement(editor, blockId, { props });
  },
};
