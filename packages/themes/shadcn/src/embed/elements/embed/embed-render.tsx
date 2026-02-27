import { useEffect, useRef, useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { useBlockSelected, useElementSelected, useYooptaEditor } from '@yoopta/editor';
import type { EmbedPluginOptions } from '@yoopta/embed';
import { Rnd } from 'react-rnd';

import { EmbedInlineToolbar } from './embed-inline-toolbar';
import { cn } from '../../../utils';
import type { EmbedElementProps } from '../../types';

type Props = {
  blockId: string;
  elementId: string;
  onUpdate: (props: Partial<EmbedElementProps>) => void;
  onDelete: () => void;
  onReplace: () => void;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
  elementProps: EmbedElementProps;
  pluginOptions?: EmbedPluginOptions;
};

export const EmbedRender = ({
  blockId,
  attributes,
  children,
  elementProps,
  onUpdate,
  onDelete,
  onReplace,
  pluginOptions,
}: Props) => {
  const [sizes, setSizes] = useState(elementProps.sizes);
  const { isElementSelected } = useElementSelected();
  const isBlockSelected = useBlockSelected({ blockId });
  const isSelected = isElementSelected && isBlockSelected;
  const rndRef = useRef<HTMLElement | null>(null);
  const editor = useYooptaEditor();

  // Get max sizes from plugin options, with default maxWidth from editor width
  const [maxSizes, setMaxSizes] = useState(() => {
    const editorWidth = editor.refElement?.getBoundingClientRect().width || Infinity;
    const maxWidth = pluginOptions?.maxWidth ?? editorWidth;

    return {
      maxWidth: typeof maxWidth === 'number' ? maxWidth : editorWidth,
      maxHeight: Infinity, // reasonable max height
    };
  });

  // Update maxSizes when editor width changes
  useEffect(() => {
    const updateMaxSizes = () => {
      const editorWidth = editor.refElement?.getBoundingClientRect().width || Infinity;
      const maxWidth = pluginOptions?.maxWidth ?? editorWidth;

      setMaxSizes({
        maxWidth: typeof maxWidth === 'number' ? maxWidth : editorWidth,
        maxHeight: Infinity,
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
  const limitEmbedSizes = (
    currentSizes: { width: number | string; height: number | string },
    limits: { width: number | string; height: number | string },
  ): { width: number; height: number } => {
    const parseSize = (value: string | number): number => {
      if (typeof value === 'number') return value;
      return parseInt(String(value).replace(/[^\d]/g, ''), 10);
    };

    const currentWidth = parseSize(currentSizes.width);
    const currentHeight = parseSize(currentSizes.height);
    const maxWidth = parseSize(limits.width);
    const maxHeight = parseSize(limits.height);

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
    const limitedSizes = limitEmbedSizes(
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
    const limitedSizes = limitEmbedSizes(
      { width: newWidth, height: newHeight },
      { width: maxSizes.maxWidth, height: maxSizes.maxHeight },
    );

    setSizes(limitedSizes);
  };

  const provider = elementProps.provider;
  const embedUrl = provider?.embedUrl ?? '';

  const copyEmbed = async () => {
    if (!provider?.url) return;

    try {
      const { default: copyFn } = await import('copy-to-clipboard');
      copyFn(provider.url);
    } catch {
      // silently fail
    }
  };

  const alignmentClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[(elementProps as any).alignment ?? 'center'];

  return (
    <div {...attributes} className={cn('group/embed mt-4 relative transition-all w-full flex', alignmentClass)}>
      <div className="relative" contentEditable={false}>
        <Rnd
          ref={(node) => {
            if (node?.resizableElement && node.resizableElement instanceof HTMLElement) {
              rndRef.current = node.resizableElement;
            }
          }}
          style={{
            position: 'relative',
            outline: isSelected ? '.125rem solid rgba(0, 0, 0, 0)' : 'none',
            outlineColor: isSelected ? 'hsl(var(--primary))' : 'none',
            padding: 2
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
            left: <div className="h-10 w-2 rounded-full border border-primary bg-primary shadow-sm" />,
            right: <div className="h-10 w-2 rounded-full border border-primary bg-primary shadow-sm" />,
          }}
          className={cn('rounded-sm overflow-hidden')}
        >
          <iframe
            title={provider?.meta?.title ?? `Embedded content from ${provider?.type ?? 'unknown'}`}
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
            style={{
              aspectRatio: `${sizes.width} / ${sizes.height}`,
            }}
          />
        </Rnd>
        {isSelected && (
          <EmbedInlineToolbar
            referenceRef={rndRef}
            elementProps={elementProps}
            onUpdate={onUpdate}
            onReplace={onReplace}
            onDelete={onDelete}
            onCopy={copyEmbed}
          />
        )}
      </div>
      {children}
    </div>
  );
};

