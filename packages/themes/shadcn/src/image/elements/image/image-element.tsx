import { useCallback } from 'react';
import { type PluginElementRenderProps, useYooptaPluginOptions } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import {
  type ImageElement as ImageElementType,
  type ImagePluginOptions,
  useImageDelete,
  useImagePreview,
  useImageUpload,
} from '@yoopta/image';
import { Editor, Element } from 'slate';

import { ImagePlaceholder } from './image-placeholder';
import { ImageRender } from './image-render';
import type { ImageElementProps } from '../../types';

export const ImageElement = ({
  element,
  attributes,
  children,
  blockId,
}: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const pluginOptions = useYooptaPluginOptions<ImagePluginOptions>('Image');
  const { upload: uploadImageToStorage, progress, loading } = useImageUpload(pluginOptions.upload!);
  const { deleteImage: deleteImageFromStorage } = useImageDelete(pluginOptions.delete!);
  const { preview, generatePreview, clearPreview } = useImagePreview();

  const updateElement = useCallback(
    (props: Partial<ImageElementProps>) => {
      Elements.updateElement(editor, blockId, {
        type: 'image',
        props: {
          ...element.props,
          ...props,
        },
      });
    },
    [editor, blockId, element.props],
  );

  const deleteImage = useCallback(() => {
    deleteImageFromStorage(element as ImageElementType);
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    const elementPath = Elements.getElementPath(editor, blockId, element);
    if (!elementPath) return;

    const parentEntry = elementPath ? Editor.parent(slate, elementPath) : undefined;
    if (parentEntry && Element.isElement(parentEntry[0]) && !Editor.isEditor(parentEntry[0])) {
      Elements.deleteElement(editor, blockId, {
        type: 'image',
        path: elementPath,
      });
      return;
    }

    Blocks.deleteBlock(editor, { blockId, focus: true });
  }, [editor, blockId, element, deleteImageFromStorage]);

  const replaceImage = useCallback(() => {
    Elements.updateElement(editor, blockId, {
      type: 'image',
      props: {
        ...element.props,
        src: null,
        alt: null,
      },
    });
  }, [editor, blockId, element.props]);

  const onUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      generatePreview(file);
      const result = await uploadImageToStorage(file);
      updateElement({
        id: result.fileId,
        src: result.url,
        alt: file.name,
        sizes: { width: result.width!, height: result.height! },
      });
      clearPreview();
    },
    [uploadImageToStorage, updateElement, generatePreview, clearPreview],
  );

  if (!element.props.src) {
    return (
      <ImagePlaceholder
        onUpload={onUpload}
        preview={preview}
        progress={progress}
        loading={loading}
        onInsertUrl={() => {}}
        onInsertFromUnsplash={() => {}}
        onInsertFromAI={async () => {}}
        attributes={attributes}>
        {children}
      </ImagePlaceholder>
    );
  }

  return (
    <ImageRender
      blockId={blockId}
      onUpdate={updateElement}
      onDelete={deleteImage}
      attributes={attributes}
      onReplace={replaceImage}
      elementProps={element.props}>
      {children}
    </ImageRender>
  );
};
