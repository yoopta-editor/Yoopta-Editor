import { useCallback } from 'react';
import { type PluginElementRenderProps, useYooptaPluginOptions } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import { useFileDelete, useFileUpload } from '@yoopta/file';
import type { FileElement as FileElementType, FilePluginOptions } from '@yoopta/file';
import { Editor, Element } from 'slate';

import { FilePlaceholder } from './file-placeholder';
import { FileRender } from './file-render';
import type { FileElementProps } from '../../types';

export const FileElement = ({ element, attributes, children, blockId }: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const pluginOptions = useYooptaPluginOptions<FilePluginOptions>('File');
  const { upload: uploadFileToStorage, progress, loading } = useFileUpload(pluginOptions.upload);
  const { deleteFile: deleteFileFromStorage } = useFileDelete(pluginOptions.delete);

  const updateElement = useCallback(
    (props: Partial<FileElementProps>) => {
      Elements.updateElement(editor, {
        blockId,
        type: 'file',
        props: {
          ...element.props,
          ...props,
        },
      });
    },
    [editor, blockId, element.props],
  );

  const deleteFile = useCallback(async () => {
    await deleteFileFromStorage(element as FileElementType);
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    const elementPath = Elements.getElementPath(editor, { blockId, element });
    if (!elementPath) return;

    const parentEntry = elementPath ? Editor.parent(slate, elementPath) : undefined;
    if (parentEntry && Element.isElement(parentEntry[0]) && !Editor.isEditor(parentEntry[0])) {
      Elements.deleteElement(editor, {
        blockId,
        type: 'file',
        path: elementPath,
      });
      return;
    }

    Blocks.deleteBlock(editor, { blockId, focus: true });
  }, [editor, blockId, element, deleteFileFromStorage]);

  const replaceFile = useCallback(() => {
    Elements.updateElement(editor, {
      blockId,
      type: 'file',
      props: {
        ...element.props,
        id: null,
        src: null,
        name: null,
        size: null,
        format: null,
      },
    });
  }, [editor, blockId, element.props]);

  const onUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const result = await uploadFileToStorage(file);

      // Parse name and format from result or file
      let name = result.name ?? file.name;
      let format: string | null = null;

      const dotIndex = name.lastIndexOf('.');
      if (dotIndex > 0) {
        format = name.slice(dotIndex + 1);
        name = name.slice(0, dotIndex);
      }

      updateElement({
        id: result.id,
        src: result.url,
        name,
        size: result.size ?? file.size,
        format,
      });
    },
    [uploadFileToStorage, updateElement],
  );

  // Show placeholder if no src
  if (!element.props.src) {
    return (
      <FilePlaceholder
        onUpload={onUpload}
        progress={progress}
        loading={loading}
        accept={pluginOptions.accept}
        attributes={attributes}>
        {children}
      </FilePlaceholder>
    );
  }

  return (
    <FileRender
      blockId={blockId}
      onDelete={deleteFile}
      attributes={attributes}
      onReplace={replaceFile}
      elementProps={element.props as FileElementProps}>
      {children}
    </FileRender>
  );
};
