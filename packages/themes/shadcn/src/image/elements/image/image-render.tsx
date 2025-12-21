import { useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { useBlockSelected, useElementSelected } from '@yoopta/editor';
import copy from 'copy-to-clipboard';
import { Rnd } from 'react-rnd';

import { ImageInlineToolbar } from './image-inline-toolbar';
import { cn } from '../../../utils';
import type { ImageElementProps } from '../../types';

type Props = {
  blockId: string;
  onUpdate: (props: Partial<ImageElementProps>) => void;
  onDelete: () => void;
  onReplace: () => void;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
  elementProps: ImageElementProps;
};

export const ImageRender = ({
  blockId,
  attributes,
  children,
  elementProps,
  onUpdate,
  onDelete,
  onReplace,
}: Props) => {
  const [sizes, setSizes] = useState(elementProps.sizes);
  const { isElementSelected } = useElementSelected();
  const isBlockSelected = useBlockSelected({ blockId });
  const isSelected = isElementSelected && isBlockSelected;

  const onResizeStop = (_e: any, _direction: any, ref: HTMLElement) => {
    const newWidth = parseInt(ref.style.width, 10);
    const newHeight = parseInt(ref.style.height, 10);

    onUpdate({
      sizes: {
        width: newWidth,
        height: newHeight,
      },
    });
  };

  const onResize = (_e: any, _direction: any, ref: HTMLElement) => {
    setSizes({
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
    });
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
      className={cn('group/image relative transition-all w-full flex', alignmentClass)}>
      <div className="relative" contentEditable={false}>
        <Rnd
          style={{
            position: 'relative',
            outline: isSelected ? '.125rem solid rgba(0, 0, 0, 0)' : 'none',
            outlineColor: isSelected ? 'hsl(var(--primary))' : 'none',
          }}
          size={{
            width: sizes.width,
            height: sizes.height,
          }}
          onResize={onResize}
          onResizeStop={onResizeStop}
          lockAspectRatio
          minWidth={100}
          minHeight={100}
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
