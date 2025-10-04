import { useEffect, useMemo, useState } from 'react';
import type {
  PluginElementRenderProps} from '@yoopta/editor';
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

import { Placeholder } from './Placeholder';
import { Resizer } from './Resizer';
import { VideoBlockOptions } from './VideoBlockOptions';
import { VideoComponent } from './VideoComponent';
import type { VideoPluginOptions } from '../types';

const VideoRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { element, blockId, attributes, children } = props;
  const {
    src,
    srcSet,
    bgColor,
    settings,
    sizes: propSizes,
    poster,
    provider,
    fit,
  } = element.props || {};
  const block = useBlockData(blockId);
  const editor = useYooptaEditor();
  const pluginOptions = useYooptaPluginOptions<VideoPluginOptions>('Video');
  const isReadOnly = useYooptaReadOnly();

  const [sizes, setSizes] = useState({
    width: propSizes?.width || 750,
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
        setSizes({ width: ref.offsetWidth, height: ref.offsetHeight });
      },
      onResizeStop: (e, direction, ref) => {
        Elements.updateElement(editor, blockId, {
          type: 'video',
          props: {
            sizes: { width: ref.offsetWidth, height: ref.offsetHeight },
          },
        });
      },
      handleComponent: {
        left: <Resizer position="left" />,
        right: <Resizer position="right" />,
      },
    }),
    [sizes.width, sizes.height],
  );

  if (!src) {
    return (
      <Placeholder attributes={attributes} blockId={blockId}>
        {children}
      </Placeholder>
    );
  }

  const currentAlign = block?.meta?.align || 'center';
  const alignClass = `yoopta-align-${currentAlign}`;

  return (
    <div
      contentEditable={false}
      draggable={false}
      className={`yoo-video-mt-4 yoo-video-relative yoo-video-flex ${alignClass} yoopta-video`}>
      <Resizable {...resizeProps} className="yoo-video-my-0 yoo-video-flex">
        {blockSelected && (
          <div className="yoo-video-absolute yoo-video-pointer-events-none yoo-video-inset-0 yoo-video-bg-[rgba(35,131,226,0.14)] yoo-video-z-[81] yoo-video-rounded-[3px] yoo-video-opacity-100 yoo-video-transition-opacity yoo-video-duration-150 yoo-video-ease-in" />
        )}
        {extendRender ? (
          extendRender(props)
        ) : (
          <VideoComponent
            src={src}
            srcSet={srcSet}
            width={sizes?.width}
            settings={settings}
            bgColor={bgColor}
            height={sizes?.height}
            poster={poster}
            provider={provider}
            fit={fit}
            attributes={attributes}>
            {children}
          </VideoComponent>
        )}

        {!isReadOnly && (
          <VideoBlockOptions
            block={block}
            editor={editor}
            settings={settings}
            props={element.props}
          />
        )}
      </Resizable>
    </div>
  );
};

export { VideoRender };
