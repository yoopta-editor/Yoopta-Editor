import { useEffect, useState } from 'react';
import {
  ContentCopy,
  Delete as DeleteIcon,
  Download,
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
  RotateLeft,
} from '@mui/icons-material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { alpha, useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import { ImageInlineToolbarSettings } from './image-inline-toolbar-settings';
import type { ImageElementProps } from '../../types';

type ImageInlineToolbarProps = {
  elementProps: ImageElementProps;
  onUpdate: (props: Partial<ImageElementProps>) => void;
  onReplace: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onCopy: () => void;
};

export const ImageInlineToolbar = ({
  elementProps,
  onUpdate,
  onReplace,
  onDelete,
  onDownload,
  onCopy,
}: ImageInlineToolbarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Paper
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      elevation={8}
      sx={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '100%',
        mb: 1,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(8px)',
        p: 0.5,
        transition: 'all 0.2s ease-out',
        opacity: isVisible ? 1 : 0,
      }}>
      {/* Alignment buttons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.25,
          borderRight: 1,
          borderColor: 'divider',
          pr: 0.5,
        }}>
        <Tooltip title="Align left" arrow>
          <IconButton
            size="small"
            onClick={() => onUpdate({ alignment: 'left' })}
            color={elementProps.alignment === 'left' ? 'primary' : 'default'}
            sx={{ width: 28, height: 28 }}>
            <FormatAlignLeft fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Align center" arrow>
          <IconButton
            size="small"
            onClick={() => onUpdate({ alignment: 'center' })}
            color={elementProps.alignment === 'center' ? 'primary' : 'default'}
            sx={{ width: 28, height: 28 }}>
            <FormatAlignCenter fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Align right" arrow>
          <IconButton
            size="small"
            onClick={() => onUpdate({ alignment: 'right' })}
            color={elementProps.alignment === 'right' ? 'primary' : 'default'}
            sx={{ width: 28, height: 28 }}>
            <FormatAlignRight fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Tooltip title="Replace" arrow>
        <IconButton size="small" onClick={onReplace} sx={{ width: 28, height: 28 }}>
          <RotateLeft fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Download" arrow>
        <IconButton size="small" onClick={onDownload} sx={{ width: 28, height: 28 }}>
          <Download fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Copy" arrow>
        <IconButton size="small" onClick={onCopy} sx={{ width: 28, height: 28 }}>
          <ContentCopy fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <ImageInlineToolbarSettings
        fit={elementProps.fit ?? 'contain'}
        alt={elementProps.alt || ''}
        borderRadius={elementProps.borderRadius ?? 0}
        onUpdate={onUpdate}
      />

      <Tooltip title="Delete" arrow>
        <IconButton
          size="small"
          onClick={onDelete}
          sx={{
            width: 28,
            height: 28,
            color: 'error.main',
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1),
            },
          }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};
