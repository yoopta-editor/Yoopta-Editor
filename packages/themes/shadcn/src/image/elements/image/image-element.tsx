import { useCallback } from 'react';
import { type PluginElementRenderProps } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
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
  }, [editor, blockId, element]);

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

  if (!element.props.src) {
    return (
      <ImagePlaceholder
        onUpload={() => {}}
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
