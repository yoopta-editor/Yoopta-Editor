import { useCallback } from 'react';
import { type PluginElementRenderProps, useYooptaPluginOptions } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import {
  buildVideoProvider,
  parseVideoUrl,
  useVideoDelete,
  useVideoPreview,
  useVideoUpload
} from '@yoopta/video';
import type {
  VideoElement as VideoElementType,
  VideoPluginOptions
} from '@yoopta/video';
import { Editor, Element } from 'slate';

import { VideoPlaceholder } from './video-placeholder';
import { VideoRender } from './video-render';
import type { VideoElementProps } from '../../types';

export const VideoElement = ({
  element,
  attributes,
  children,
  blockId,
}: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const pluginOptions = useYooptaPluginOptions<VideoPluginOptions>('Video');
  const { upload: uploadVideoToStorage, progress, loading } = useVideoUpload(pluginOptions.upload!);
  const { deleteVideo: deleteVideoFromStorage } = useVideoDelete(pluginOptions.delete!);
  const { preview, generatePreview, clearPreview } = useVideoPreview();

  const updateElement = useCallback(
    (props: Partial<VideoElementProps>) => {
      Elements.updateElement(editor, {
        blockId,
        type: 'video',
        props: {
          ...element.props,
          ...props,
        },
      });
    },
    [editor, blockId, element.props],
  );

  const deleteVideo = useCallback(() => {
    deleteVideoFromStorage(element as VideoElementType);
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    const elementPath = Elements.getElementPath(editor, { blockId, element });
    if (!elementPath) return;

    const parentEntry = elementPath ? Editor.parent(slate, elementPath) : undefined;
    if (parentEntry && Element.isElement(parentEntry[0]) && !Editor.isEditor(parentEntry[0])) {
      Elements.deleteElement(editor, {
        blockId,
        type: 'video',
        path: elementPath,
      });
      return;
    }

    Blocks.deleteBlock(editor, { blockId, focus: true });
  }, [editor, blockId, element, deleteVideoFromStorage]);

  const replaceVideo = useCallback(() => {
    Elements.updateElement(editor, {
      blockId,
      type: 'video',
      props: {
        ...element.props,
        src: null,
        provider: null,
      },
    });
  }, [editor, blockId, element.props]);

  const onUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      generatePreview(file);
      const result = await uploadVideoToStorage(file);
      updateElement({
        id: result.id || (result as any).fileId,
        src: result.url,
        sizes: result.width && result.height
          ? { width: result.width, height: result.height }
          : element.props.sizes || { width: 650, height: 400 },
        provider: result.provider || null,
        poster: result.poster || null,
      });
      clearPreview();
    },
    [uploadVideoToStorage, updateElement, generatePreview, clearPreview, element.props.sizes],
  );

  const onInsertUrl = useCallback(
    async (url: string) => {
      const parsed = parseVideoUrl(url);

      if (parsed.isValid && parsed.provider) {
        const provider = buildVideoProvider(url);
        updateElement({
          src: parsed.embedUrl,
          provider,
          sizes: element.props.sizes || { width: 650, height: 400 },
        });
      } else if (url.trim()) {
        // Fallback: treat as direct video URL
        updateElement({
          src: url.trim(),
          provider: null,
          sizes: element.props.sizes || { width: 650, height: 400 },
        });
      }
    },
    [updateElement, element.props.sizes],
  );

  if (!element.props.src && !element.props.provider) {
    return (
      <VideoPlaceholder
        onUpload={onUpload}
        preview={preview}
        progress={progress}
        loading={loading}
        onInsertUrl={onInsertUrl}
        attributes={attributes}>
        {children}
      </VideoPlaceholder>
    );
  }

  return (
    <VideoRender
      blockId={blockId}
      elementId={element.id}
      onUpdate={updateElement}
      onDelete={deleteVideo}
      attributes={attributes}
      onReplace={replaceVideo}
      elementProps={element.props}
      pluginOptions={pluginOptions}>
      {children}
    </VideoRender>
  );
};

