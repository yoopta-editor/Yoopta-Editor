import { useState } from 'react';
import { Settings } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import type { ImageElementProps, ObjectFit } from '../../types';

type ImageInlineToolbarSettingsProps = {
  fit: ObjectFit;
  alt: string;
  borderRadius: number;
  onUpdate: (props: Partial<ImageElementProps>) => void;
};

const FIT_LABELS: Partial<Record<ObjectFit, { label: string; description: string }>> = {
  contain: { label: 'Contain', description: 'Fit within bounds' },
  cover: { label: 'Cover', description: 'Fill and crop' },
  fill: { label: 'Fill', description: 'Stretch to fit' },
};

export const ImageInlineToolbarSettings = ({
  fit,
  alt,
  borderRadius,
  onUpdate,
}: ImageInlineToolbarSettingsProps) => {
  const [localAlt, setLocalAlt] = useState(alt);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Settings" arrow>
        <IconButton
          size="small"
          onClick={handleClick}
          color={open ? 'primary' : 'default'}
          sx={{ width: 28, height: 28 }}>
          <Settings fontSize="small" />
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        contentEditable={false}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}>
        <Box sx={{ p: 3, width: 320 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Image settings
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Customize how the image appears
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Alt text
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={localAlt}
              onChange={(e) => setLocalAlt(e.target.value)}
              onBlur={() => onUpdate({ alt: localAlt })}
              placeholder="Describe this image..."
              sx={{ mb: 0.5 }}
            />
            <Typography variant="caption" color="text.secondary">
              Important for accessibility and SEO
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="object-fit-label">How image fits</InputLabel>
              <Select
                labelId="object-fit-label"
                id="object-fit"
                value={fit}
                label="How image fits"
                onChange={(e) => onUpdate({ fit: e.target.value as ObjectFit })}>
                <MenuItem value="contain">
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {FIT_LABELS.contain?.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {FIT_LABELS.contain?.description}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="cover">
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {FIT_LABELS.cover?.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {FIT_LABELS.cover?.description}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="fill">
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {FIT_LABELS.fill?.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {FIT_LABELS.fill?.description}
                    </Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                Border radius
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {borderRadius}px
              </Typography>
            </Box>
            <Slider
              value={borderRadius}
              onChange={(_, value) => onUpdate({ borderRadius: value as number })}
              min={0}
              max={50}
              step={1}
              size="small"
            />
          </Box>
        </Box>
      </Popover>
    </>
  );
};
