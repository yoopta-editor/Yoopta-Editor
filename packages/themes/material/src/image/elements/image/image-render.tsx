import { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { useBlockSelected, useElementSelected } from '@yoopta/editor';
import copy from 'copy-to-clipboard';
import { Rnd } from 'react-rnd';

import { ImageInlineToolbar } from './image-inline-toolbar';
import type { ImageElementProps } from '../../types';

type Props = {
  blockId: string;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
  elementProps: ImageElementProps;
  onUpdate: (props: Partial<ImageElementProps>) => void;
  onDelete: () => void;
  onReplace: () => void;
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
  const theme = useTheme();

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

  const alignmentStyles = {
    left: { justifyContent: 'flex-start' },
    center: { justifyContent: 'center' },
    right: { justifyContent: 'flex-end' },
  }[elementProps.alignment ?? 'center'];

  return (
    <Box
      {...attributes}
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        transition: 'all 0.2s',
        ...alignmentStyles,
      }}>
      <Box sx={{ position: 'relative' }} contentEditable={false}>
        {isSelected ? (
          <Rnd
            style={{
              position: 'relative',
              outline: `0.125rem solid ${theme.palette.primary.main}`,
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
            enableResizing={{
              bottom: false,
              bottomLeft: false,
              bottomRight: false,
              left: true,
              right: true,
              top: false,
              topLeft: false,
              topRight: false,
            }}
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
                <Box
                  sx={{
                    height: 40,
                    width: 8,
                    borderRadius: '9999px',
                    border: `1px solid ${theme.palette.primary.main}`,
                    bgcolor: theme.palette.primary.main,
                    boxShadow: theme.shadows[2],
                  }}
                />
              ),
              right: (
                <Box
                  sx={{
                    height: 40,
                    width: 8,
                    borderRadius: '9999px',
                    border: `1px solid ${theme.palette.primary.main}`,
                    bgcolor: theme.palette.primary.main,
                    boxShadow: theme.shadows[2],
                  }}
                />
              ),
            }}>
            <Box
              component="img"
              src={elementProps.src}
              alt={elementProps.alt || ''}
              sx={{
                width: '100%',
                height: '100%',
                transition: 'all 0.2s',
                objectFit: elementProps.fit,
                borderRadius: `${elementProps.borderRadius ?? 0}px`,
              }}
              draggable={false}
            />
          </Rnd>
        ) : (
          <Box
            component="img"
            src={elementProps.src}
            alt={elementProps.alt || ''}
            sx={{
              transition: 'all 0.2s',
              width: sizes.width,
              height: sizes.height,
              objectFit: elementProps.fit,
              borderRadius: `${elementProps.borderRadius ?? 0}px`,
            }}
            draggable={false}
          />
        )}

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
      </Box>
      {children}
    </Box>
  );
};
