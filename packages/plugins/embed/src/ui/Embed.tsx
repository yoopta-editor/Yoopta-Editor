import { EmbedComponent } from './EmbedComponent';
import {
  useBlockData,
  PluginElementRenderProps,
  useYooptaEditor,
  useYooptaPluginOptions,
  useBlockSelected,
  useYooptaReadOnly,
  Elements,
} from '@yoopta/editor';
import { Resizable, ResizableProps } from 're-resizable';
import { useEffect, useMemo, useState } from 'react';
import { Placeholder } from './Placeholder';
import { EmbedPluginOptions } from '../types';
import { EmbedBlockOptions } from './EmbedBlockOptions';
import { Resizer } from './Resizer';

const EmbedRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { element, children, attributes, blockId } = props;
  const { sizes: propSizes, provider } = element.props || {};
  const block = useBlockData(blockId);
  const editor = useYooptaEditor();
  const pluginOptions = useYooptaPluginOptions<EmbedPluginOptions>('Embed');
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
      maxHeight: pluginOptions?.maxSizes?.maxHeight || 900,
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
          type: 'embed',
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

  if (!provider || !provider?.id) {
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
      className={`yoo-embed-mt-4 yoo-embed-relative yoo-embed-flex ${alignClass} yoopta-embed`}>
      <Resizable {...resizeProps} className="yoo-embed-my-0 yoo-embed-flex">
        {blockSelected && (
          <div className="yoo-embed-absolute yoo-embed-pointer-events-none yoo-embed-inset-0 yoo-embed-bg-[rgba(35,131,226,0.14)] yoo-embed-z-[81] yoo-embed-rounded-[3px] yoo-embed-opacity-100 yoo-embed-transition-opacity yoo-embed-duration-150 yoo-embed-ease-in" />
        )}
        {extendRender ? (
          extendRender(props)
        ) : (
          <EmbedComponent
            width={sizes?.width || 650}
            height={sizes?.height || 550}
            provider={provider}
            blockId={blockId}
            attributes={attributes}>
            {children}
          </EmbedComponent>
        )}

        {!isReadOnly && <EmbedBlockOptions block={block} editor={editor} props={element.props} />}
      </Resizable>
    </div>
  );
};

export { EmbedRender };
