import { useEffect, useMemo, useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import {
  Elements,
  useBlockData,
  useBlockSelected,
  useYooptaEditor,
  useYooptaPluginOptions,
  useYooptaReadOnly,
} from '@yoopta/editor';
import type { ResizableProps } from 're-resizable';
import { Resizable } from 're-resizable';

import { ImageBlockOptions } from './ImageBlockOptions';
import { ImageComponent } from './ImageComponent';
import { Placeholder } from './Placeholder';
import { Resizer } from './Resizer';
import type { ImagePluginOptions } from '../types';

const ImageRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { element, blockId, children, attributes } = props;
  const { src, alt, srcSet, bgColor, fit, sizes: propSizes } = element.props || {};
  const blockData = useBlockData(blockId);
  const editor = useYooptaEditor();
  const isReadOnly = useYooptaReadOnly();

  const pluginOptions = useYooptaPluginOptions<ImagePluginOptions>('Image');

  const [sizes, setSizes] = useState({
    width: propSizes?.width || 650,
    height: propSizes?.height || 440,
  });

  useEffect(
    () =>
      setSizes({
        width: propSizes?.width || 650,
        height: propSizes?.height || 440,
      }),
    [element.props],
  );

  const blockSelected = useBlockSelected({ blockId });

  const resizeProps: ResizableProps = useMemo(
    () => ({
      minWidth: 300,
      size: { width: sizes.width, height: sizes.height },
      maxWidth: pluginOptions?.maxSizes?.maxWidth || 800,
      maxHeight: pluginOptions?.maxSizes?.maxHeight || 720,
      lockAspectRatio: true,
      resizeRatio: 2,
      enable: {
        left: !isReadOnly,
        right: !isReadOnly,
      },
      handleStyles: {
        left: { left: 0 },
        right: { right: 0 },
      },
      onResize: (e, direction, ref) => {
        if (isReadOnly) return;
        setSizes({ width: ref.offsetWidth, height: ref.offsetHeight });
      },
      onResizeStop: (e, direction, ref) => {
        if (isReadOnly) return;
        Elements.updateElement(editor, blockId, {
          type: 'image',
          props: {
            sizes: { width: ref.offsetWidth, height: ref.offsetHeight },
          },
        });
      },
      handleComponent: {
        left: isReadOnly ? <></> : <Resizer position="left" />,
        right: isReadOnly ? <></> : <Resizer position="right" />,
      },
    }),
    [sizes.width, sizes.height],
  );

  if (!src) {
    if (isReadOnly) return <></>;

    return (
      <Placeholder attributes={attributes} blockId={blockId}>
        {children}
      </Placeholder>
    );
  }

  const currentAlign = blockData?.meta?.align || 'center';
  const alignClass = `yoopta-align-${currentAlign}`;

  return (
    <div
      contentEditable={false}
      draggable={false}
      className={`yoo-image-mt-4 yoo-image-relative yoo-image-flex ${alignClass} yoopta-image`}>
      <Resizable {...resizeProps} className="yoo-image-my-0 yoo-image-flex">
        {blockSelected && (
          <div className="yoo-image-absolute yoo-image-pointer-events-none yoo-image-inset-0 yoo-image-bg-[rgba(35,131,226,0.14)] yoo-image-z-[81] yoo-image-rounded-[3px] yoo-image-opacity-100 yoo-image-transition-opacity yoo-image-duration-150 yoo-image-ease-in" />
        )}
        {extendRender ? (
          extendRender(props)
        ) : (
          <ImageComponent
            src={src}
            alt={alt}
            srcSet={srcSet}
            fit={fit}
            width={sizes?.width}
            bgColor={bgColor}
            height={sizes?.height}
            attributes={attributes}>
            {children}
          </ImageComponent>
        )}
        {!isReadOnly && (
          <ImageBlockOptions block={blockData} editor={editor} props={element.props} />
        )}
      </Resizable>
    </div>
  );
};

export { ImageRender };
