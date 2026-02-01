import { useCallback } from 'react';
import { type PluginElementRenderProps, useYooptaPluginOptions } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import { calculateEmbedDimensions, parseEmbedUrl } from '@yoopta/embed';
import type { EmbedElement as EmbedElementType, EmbedPluginOptions } from '@yoopta/embed';
import { Editor, Element } from 'slate';

import { EmbedPlaceholder } from './embed-placeholder';
import { EmbedRender } from './embed-render';
import type { EmbedElementProps } from '../../types';

export const EmbedElement = ({ element, attributes, children, blockId }: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const pluginOptions = useYooptaPluginOptions<EmbedPluginOptions>('Embed');

  const updateElement = useCallback(
    (props: Partial<EmbedElementProps>) => {
      Elements.updateElement(editor, {
        blockId,
        type: 'embed',
        props: {
          ...element.props,
          ...props,
        },
      });
    },
    [editor, blockId, element.props],
  );

  const deleteEmbed = useCallback(async () => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    const elementPath = Elements.getElementPath(editor, { blockId, element });
    if (!elementPath) return;

    const parentEntry = elementPath ? Editor.parent(slate, elementPath) : undefined;
    if (parentEntry && Element.isElement(parentEntry[0]) && !Editor.isEditor(parentEntry[0])) {
      Elements.deleteElement(editor, {
        blockId,
        type: 'embed',
        path: elementPath,
      });
      return;
    }

    Blocks.deleteBlock(editor, { blockId, focus: true });
  }, [editor, blockId, element]);

  const replaceEmbed = useCallback(() => {
    Elements.updateElement(editor, {
      blockId,
      type: 'embed',
      props: {
        ...element.props,
        provider: null,
      },
    });
  }, [editor, blockId, element.props]);

  const onInsertUrl = useCallback(
    async (url: string) => {
      const provider = parseEmbedUrl(url);

      if (provider) {
        // Calculate dimensions based on provider aspect ratio
        const maxWidth = pluginOptions?.maxWidth ?? 650;
        const { width, height } = calculateEmbedDimensions(provider.type, maxWidth);

        updateElement({
          provider,
          sizes: { width, height },
        });
      }
    },
    [updateElement, pluginOptions],
  );

  const embedElement = element as EmbedElementType;

  if (!embedElement.props?.provider) {
    return (
      <EmbedPlaceholder onInsertUrl={onInsertUrl} attributes={attributes}>
        {children}
      </EmbedPlaceholder>
    );
  }

  return (
    <EmbedRender
      blockId={blockId}
      elementId={element.id}
      onUpdate={updateElement}
      onDelete={deleteEmbed}
      attributes={attributes}
      onReplace={replaceEmbed}
      elementProps={embedElement.props}
      pluginOptions={pluginOptions}
    >
      {children}
    </EmbedRender>
  );
};

