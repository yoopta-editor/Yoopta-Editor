import { useEffect, useRef, useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { useBlockSelected, useElementSelected, useYooptaEditor } from '@yoopta/editor';
import type { VideoPluginOptions } from '@yoopta/video';
import { getEmbedUrl } from '@yoopta/video';
import { Rnd } from 'react-rnd';

import { VideoInlineToolbar } from './video-inline-toolbar';
import { cn } from '../../../utils';
import type { VideoElementProps } from '../../types';

type Props = {
  blockId: string;
  elementId: string;
  onUpdate: (props: Partial<VideoElementProps>) => void;
  onDelete: () => void;
  onReplace: () => void;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
  elementProps: VideoElementProps;
  pluginOptions?: VideoPluginOptions;
};

export const VideoRender = ({
  blockId,
  attributes,
  children,
  elementProps,
  onUpdate,
  onDelete,
  onReplace,
  pluginOptions,
}: Props) => {
  const [sizes, setSizes] = useState(elementProps.sizes || { width: 650, height: 400 });
  const { isElementSelected } = useElementSelected();
  const isBlockSelected = useBlockSelected({ blockId });
  const isSelected = isElementSelected && isBlockSelected;
  const rndRef = useRef<HTMLElement | null>(null);
  const editor = useYooptaEditor();

  // Get max sizes from plugin options, with default maxWidth from editor width
  const [maxSizes, setMaxSizes] = useState(() => {
    const editorWidth = editor.refElement?.getBoundingClientRect().width || 650;
    const maxSizesOptions = pluginOptions?.maxSizes;

    return {
      maxWidth: maxSizesOptions?.maxWidth
        ? typeof maxSizesOptions.maxWidth === 'number'
          ? maxSizesOptions.maxWidth
          : parseInt(String(maxSizesOptions.maxWidth).replace(/[^\d]/g, ''), 10)
        : editorWidth,
      maxHeight: maxSizesOptions?.maxHeight
        ? typeof maxSizesOptions.maxHeight === 'number'
          ? maxSizesOptions.maxHeight
          : parseInt(String(maxSizesOptions.maxHeight).replace(/[^\d]/g, ''), 10)
        : 550,
    };
  });

  // Update maxSizes when editor width changes
  useEffect(() => {
    const updateMaxSizes = () => {
      const editorWidth = editor.refElement?.getBoundingClientRect().width || 650;
      const pluginMaxSizes = pluginOptions?.maxSizes;

      setMaxSizes({
        maxWidth: pluginMaxSizes?.maxWidth
          ? typeof pluginMaxSizes.maxWidth === 'number'
            ? pluginMaxSizes.maxWidth
            : parseInt(String(pluginMaxSizes.maxWidth).replace(/[^\d]/g, ''), 10)
          : editorWidth,
        maxHeight: pluginMaxSizes?.maxHeight
          ? typeof pluginMaxSizes.maxHeight === 'number'
            ? pluginMaxSizes.maxHeight
            : parseInt(String(pluginMaxSizes.maxHeight).replace(/[^\d]/g, ''), 10)
          : 550,
      });
    };

    updateMaxSizes();

    const resizeObserver = new ResizeObserver(updateMaxSizes);
    if (editor.refElement) {
      resizeObserver.observe(editor.refElement);
    }

    window.addEventListener('resize', updateMaxSizes);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateMaxSizes);
    };
  }, [editor, pluginOptions]);

  // Helper function to limit sizes
  const limitVideoSizes = (
    sizes: { width: number | string; height: number | string },
    maxSizes: { width: number | string; height: number | string },
  ): { width: number; height: number } => {
    const parseSize = (value: string | number): number => {
      if (typeof value === 'number') return value;
      return parseInt(String(value).replace(/[^\d]/g, ''), 10);
    };

    const currentWidth = parseSize(sizes.width);
    const currentHeight = parseSize(sizes.height);
    const maxWidth = parseSize(maxSizes.width);
    const maxHeight = parseSize(maxSizes.height);

    if (currentWidth <= maxWidth && currentHeight <= maxHeight) {
      return { width: currentWidth, height: currentHeight };
    }

    const widthRatio = currentWidth / maxWidth;
    const heightRatio = currentHeight / maxHeight;
    const ratio = Math.max(widthRatio, heightRatio);

    const newWidth = Math.round(currentWidth / ratio);
    const newHeight = Math.round(currentHeight / ratio);

    return {
      width: Math.min(newWidth, maxWidth),
      height: Math.min(newHeight, maxHeight),
    };
  };

  const onResizeStop = (_e: any, _direction: any, ref: HTMLElement) => {
    const newWidth = parseInt(ref.style.width, 10);
    const newHeight = parseInt(ref.style.height, 10);

    // Apply max size limits
    const limitedSizes = limitVideoSizes(
      { width: newWidth, height: newHeight },
      { width: maxSizes.maxWidth, height: maxSizes.maxHeight },
    );

    onUpdate({
      sizes: limitedSizes,
    });
  };

  const onResize = (_e: any, _direction: any, ref: HTMLElement) => {
    const newWidth = parseInt(ref.style.width, 10);
    const newHeight = parseInt(ref.style.height, 10);

    // Apply max size limits during resize
    const limitedSizes = limitVideoSizes(
      { width: newWidth, height: newHeight },
      { width: maxSizes.maxWidth, height: maxSizes.maxHeight },
    );

    setSizes(limitedSizes);
  };

  const isProviderVideo = elementProps.provider && elementProps.provider.type;
  const videoSrc = elementProps.src || '';
  const embedUrl = isProviderVideo && elementProps.provider?.id
    ? getEmbedUrl(elementProps.provider.type, elementProps.provider.id)
    : null;

  const settings = elementProps.settings || {
    controls: true,
    loop: false,
    muted: false,
    autoPlay: false,
  };

  const download = async () => {
    if (!elementProps.src || isProviderVideo) return;

    try {
      const response = await fetch(elementProps.src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${Date.now()}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      // error
    }
  };

  const copyVideo = async () => {
    if (!elementProps.src) return;

    try {
      if (isProviderVideo && elementProps.provider?.url) {
        const { default: copy } = await import('copy-to-clipboard');
        copy(elementProps.provider.url);
      } else {
        const response = await fetch(elementProps.src);
        const blob = await response.blob();

        if (navigator.clipboard && ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        } else {
          const { default: copy } = await import('copy-to-clipboard');
          copy(elementProps.src);
        }
      }
    } catch (error) {
      const { default: copy } = await import('copy-to-clipboard');
      copy(elementProps.src || '');
    }
  };

  const alignmentClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[elementProps.alignment ?? 'center'];

  return (
    <div
      {...attributes}
      className={cn('group/video mt-2 relative transition-all w-full flex', alignmentClass)}>
      <div className="relative" contentEditable={false}>
        <Rnd
          ref={(node) => {
            // Get the actual DOM element from Rnd
            if (node?.resizableElement && node.resizableElement instanceof HTMLElement) {
              rndRef.current = node.resizableElement;
            }
          }}
          style={{
            position: 'relative',
            outline: isSelected ? '.125rem solid rgba(0, 0, 0, 0)' : 'none',
            outlineColor: isSelected ? 'hsl(var(--primary))' : 'none',
          }}
          size={{
            width: typeof sizes.width === 'number' ? sizes.width : parseInt(String(sizes.width), 10),
            height: typeof sizes.height === 'number' ? sizes.height : parseInt(String(sizes.height), 10),
          }}
          onResize={onResize}
          onResizeStop={onResizeStop}
          lockAspectRatio
          minWidth={200}
          minHeight={150}
          maxWidth={maxSizes.maxWidth}
          maxHeight={maxSizes.maxHeight}
          enableResizing={
            isSelected
              ? {
                bottom: false,
                bottomLeft: false,
                bottomRight: false,
                left: true,
                right: true,
                top: false,
                topLeft: false,
                topRight: false,
              }
              : false
          }
          disableDragging
          resizeHandleStyles={{
            left: {
              width: 'auto',
              height: '40px',
              left: '-5px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'ew-resize',
            },
            right: {
              width: 'auto',
              height: '40px',
              right: '-5px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'ew-resize',
            },
          }}
          resizeHandleComponent={{
            left: (
              <div className="h-10 w-2 rounded-full border border-primary bg-primary shadow-sm" />
            ),
            right: (
              <div className="h-10 w-2 rounded-full border border-primary bg-primary shadow-sm" />
            ),
          }}
          className={cn('rounded-sm overflow-hidden')}>
          {isProviderVideo && embedUrl ? (
            <iframe
              title={elementProps.provider!.type!}
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              style={{
                aspectRatio: `${sizes.width} / ${sizes.height}`,
              }}
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              title="Video"
              src={videoSrc}
              controls={settings.controls}
              loop={settings.loop}
              muted={settings.muted}
              autoPlay={settings.autoPlay}
              poster={elementProps.poster ?? undefined}
              className="w-full h-full transition-all duration-200"
              style={{
                objectFit: elementProps.fit ?? 'contain',
              }}
              draggable={false}
            />
          )}
        </Rnd>
        {isSelected && (
          <VideoInlineToolbar
            referenceRef={rndRef}
            elementProps={elementProps}
            onUpdate={onUpdate}
            onReplace={onReplace}
            onDelete={onDelete}
            onDownload={download}
            onCopy={copyVideo}
          />
        )}
      </div>
      {children}
    </div>
  );
};

