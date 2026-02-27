import { useEffect, useRef, useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { useBlockSelected, useElementSelected, useYooptaEditor } from '@yoopta/editor';
import type { ImagePluginOptions } from '@yoopta/image';
import copy from 'copy-to-clipboard';
import { Rnd } from 'react-rnd';

import { ImageInlineToolbar } from './image-inline-toolbar';
import { cn } from '../../../utils';
import type { ImageElementProps } from '../../types';

type Props = {
  blockId: string;
  elementId: string;
  onUpdate: (props: Partial<ImageElementProps>) => void;
  onDelete: () => void;
  onReplace: () => void;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
  elementProps: ImageElementProps;
  pluginOptions?: ImagePluginOptions;
};

export const ImageRender = ({
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
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const editor = useYooptaEditor();

  // Get max sizes from plugin options, with default maxWidth from editor width
  const [maxSizes, setMaxSizes] = useState(() => {
    const editorWidth = editor.refElement?.getBoundingClientRect().width ?? Infinity;
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
        : Infinity,
    };
  });

  // Update maxSizes when editor width changes
  useEffect(() => {
    const updateMaxSizes = () => {
      const editorWidth = editor.refElement?.getBoundingClientRect().width ?? Infinity;
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
          : Infinity,
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

  // Helper function to limit sizes (similar to limitSizes from @yoopta/image)
  const limitImageSizes = (
    // eslint-disable-next-line @typescript-eslint/no-shadow
    sizes: { width: number | string; height: number | string },
    // eslint-disable-next-line @typescript-eslint/no-shadow
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
    const limitedSizes = limitImageSizes(
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
    const limitedSizes = limitImageSizes(
      { width: newWidth, height: newHeight },
      { width: maxSizes.maxWidth, height: maxSizes.maxHeight },
    );

    setSizes(limitedSizes);
  };

  const download = async () => {
    try {
      const response = await fetch(elementProps.src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      // error
    }
  };

  const copyImage = async () => {
    try {
      const response = await fetch(elementProps.src);
      const blob = await response.blob();

      if (navigator.clipboard && ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      } else {
        copy(elementProps.src);
      }
    } catch (error) {
      copy(elementProps.src);
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
      className={cn('group/image mt-4 relative transition-all w-full flex', alignmentClass)}>
      <div className="relative" contentEditable={false} ref={imageContainerRef}>
        <Rnd
          style={{
            position: 'relative',
            outline: isSelected ? '.125rem solid rgba(0, 0, 0, 0)' : 'none',
            outlineColor: isSelected ? 'hsl(var(--primary))' : 'none',
            padding: 2
          }}
          onResize={onResize}
          onResizeStop={onResizeStop}
          lockAspectRatio
          minWidth={100}
          minHeight={100}
          position={{ x: Infinity, y: 0 }}
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
              <div className="h-10 w-2 rounded-full bg-primary shadow-md ring-2 ring-white/80" />
            ),
            right: (
              <div className="h-10 w-2 rounded-full bg-primary shadow-md ring-2 ring-white/80" />
            ),
          }}
          className={cn('rounded-sm')}>
          <img
            src={elementProps.src}
            alt={elementProps.alt || ''}
            className="w-full h-full transition-all duration-200"
            style={{
              objectFit: elementProps.fit,
              borderRadius: `${elementProps.borderRadius}px`,
            }}
            draggable={false}
          />
        </Rnd>
        {isSelected && (
          <ImageInlineToolbar
            referenceRef={imageContainerRef}
            elementProps={elementProps}
            onUpdate={onUpdate}
            onReplace={onReplace}
            onDelete={onDelete}
            onDownload={download}
            onCopy={copyImage}
          />
        )}
      </div>
      {children}
    </div>
  );
};
