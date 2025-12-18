import { useCallback, useRef, useState } from 'react';
import {
  AutoAwesome,
  CloudUpload,
  Image as ImageIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Paper,
  Popover,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import type { PluginElementRenderProps } from '@yoopta/editor';

type ImagePlaceholderProps = {
  onUpload: (file: File) => void;
  onInsertUrl: (url: string) => void;
  onInsertFromUnsplash?: () => void;
  onInsertFromAI?: (prompt: string) => Promise<void>;
  sx?: object;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
};

export const ImagePlaceholder = ({
  onUpload,
  onInsertUrl,
  onInsertFromUnsplash,
  onInsertFromAI,
  sx,
  attributes,
  children,
}: ImagePlaceholderProps) => {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [urlAnchorEl, setUrlAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [aiAnchorEl, setAiAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onUpload(file);
      }
    },
    [onUpload],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUpload(file);
      }
    },
    [onUpload],
  );

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      onInsertUrl(urlInput.trim());
      setUrlInput('');
      setUrlAnchorEl(null);
    }
  }, [urlInput, onInsertUrl]);

  const handleAIGenerate = useCallback(async () => {
    if (aiPrompt.trim() && onInsertFromAI) {
      setIsGenerating(true);
      try {
        await onInsertFromAI(aiPrompt.trim());
        setAiPrompt('');
        setAiAnchorEl(null);
      } finally {
        setIsGenerating(false);
      }
    }
  }, [aiPrompt, onInsertFromAI]);

  const isUrlPopoverOpen = Boolean(urlAnchorEl);
  const isAiPopoverOpen = Boolean(aiAnchorEl);

  return (
    <Paper
      {...attributes}
      contentEditable={false}
      elevation={0}
      sx={{
        position: 'relative',
        border: 2,
        borderStyle: 'dashed',
        borderColor: isDragging ? 'primary.main' : alpha(theme.palette.divider, 0.3),
        borderRadius: 2,
        bgcolor: isDragging ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        '&:hover': {
          borderColor: alpha(theme.palette.divider, 0.5),
          bgcolor: alpha(theme.palette.action.hover, 0.02),
        },
        ...sx,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>
      <Stack alignItems="center" justifyContent="center" spacing={3} sx={{ py: 8, px: 4 }}>
        {/* Icon */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isDragging ? 'primary.main' : alpha(theme.palette.action.selected, 0.08),
            color: isDragging ? 'primary.contrastText' : 'text.secondary',
            transition: 'all 0.2s ease',
          }}>
          <ImageIcon sx={{ fontSize: 32 }} />
        </Box>

        {/* Text */}
        <Box textAlign="center">
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {isDragging ? 'Drop image here' : 'Add an image'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag and drop, paste, or click to upload
          </Typography>
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
          {/* Upload Button */}
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
            sx={{ textTransform: 'none' }}>
            Upload
          </Button>

          {/* Link Button */}
          <Button
            variant="outlined"
            startIcon={<LinkIcon />}
            onClick={(e) => setUrlAnchorEl(e.currentTarget)}
            sx={{ textTransform: 'none' }}>
            Link
          </Button>

          {/* Unsplash Button */}
          {onInsertFromUnsplash && (
            <Button
              variant="outlined"
              startIcon={
                <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" />
                </svg>
              }
              onClick={onInsertFromUnsplash}
              sx={{ textTransform: 'none' }}>
              Unsplash
            </Button>
          )}

          {/* AI Generate Button */}
          {onInsertFromAI && (
            <Button
              variant="outlined"
              startIcon={<AutoAwesome />}
              onClick={(e) => setAiAnchorEl(e.currentTarget)}
              sx={{ textTransform: 'none' }}>
              Generate
            </Button>
          )}
        </Stack>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Stack>

      {/* URL Popover */}
      <Popover
        open={isUrlPopoverOpen}
        anchorEl={urlAnchorEl}
        onClose={() => setUrlAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { width: 360, p: 2 },
        }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Embed image
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Paste a link to an image
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUrlSubmit();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              sx={{ textTransform: 'none' }}>
              Embed
            </Button>
          </Stack>
        </Stack>
      </Popover>

      {/* AI Popover */}
      <Popover
        open={isAiPopoverOpen}
        anchorEl={aiAnchorEl}
        onClose={() => setAiAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { width: 360, p: 2 },
        }}>
        <Stack spacing={2}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AutoAwesome color="primary" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={600}>
                Generate with AI
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Describe the image you want to create
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="A sunset over mountains..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAIGenerate();
                }
              }}
              disabled={isGenerating}
            />
            <Button
              variant="contained"
              onClick={handleAIGenerate}
              disabled={isGenerating || !aiPrompt.trim()}
              sx={{ textTransform: 'none', minWidth: 100 }}>
              {isGenerating ? <CircularProgress size={20} color="inherit" /> : 'Generate'}
            </Button>
          </Stack>
        </Stack>
      </Popover>

      {/* Drag overlay */}
      <Fade in={isDragging}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            pointerEvents: 'none',
            borderRadius: 2,
          }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              bgcolor: 'background.paper',
            }}>
            <Typography variant="body2" fontWeight={600}>
              Drop to upload
            </Typography>
          </Paper>
        </Box>
      </Fade>
      {children}
    </Paper>
  );
};

// Компактная версия с табами
type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`image-tabpanel-${index}`}
    aria-labelledby={`image-tab-${index}`}
    {...other}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

export const ImagePlaceholderCompact = ({
  onUpload,
  onInsertUrl,
  onInsertFromUnsplash,
  onInsertFromAI,
  sx,
  attributes,
  children,
}: ImagePlaceholderProps) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const tabs = [
    { label: 'Upload', icon: <CloudUpload fontSize="small" /> },
    { label: 'Link', icon: <LinkIcon fontSize="small" /> },
  ];

  if (onInsertFromUnsplash) {
    tabs.push({
      label: 'Unsplash',
      icon: (
        <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
          <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" />
        </svg>
      ),
    });
  }

  if (onInsertFromAI) {
    tabs.push({
      label: 'AI',
      icon: <AutoAwesome fontSize="small" />,
    });
  }

  return (
    <Paper
      {...attributes}
      contentEditable={false}
      elevation={1}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        ...sx,
      }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.action.selected, 0.02),
        }}>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            icon={tab.icon}
            iconPosition="start"
            sx={{ textTransform: 'none', minHeight: 48 }}
          />
        ))}
      </Tabs>

      <Box sx={{ p: 3 }}>
        {/* Upload Tab */}
        <TabPanel value={tabValue} index={0}>
          <Stack alignItems="center" spacing={3}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.action.selected, 0.08),
              }}>
              <ImageIcon sx={{ fontSize: 28, color: 'text.secondary' }} />
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Upload an image
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Click or drag and drop
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => fileInputRef.current?.click()}
              sx={{ textTransform: 'none' }}>
              Choose file
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
              }}
              style={{ display: 'none' }}
            />
          </Stack>
        </TabPanel>

        {/* Link Tab */}
        <TabPanel value={tabValue} index={1}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              placeholder="Paste image URL..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && urlInput.trim()) {
                  onInsertUrl(urlInput.trim());
                  setUrlInput('');
                }
              }}
              size="small"
            />
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                if (urlInput.trim()) {
                  onInsertUrl(urlInput.trim());
                  setUrlInput('');
                }
              }}
              disabled={!urlInput.trim()}
              sx={{ textTransform: 'none' }}>
              Embed image
            </Button>
          </Stack>
        </TabPanel>

        {/* Unsplash Tab */}
        {onInsertFromUnsplash && (
          <TabPanel value={tabValue} index={2}>
            <Stack alignItems="center" spacing={3}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.action.selected, 0.08),
                }}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" />
                </svg>
              </Box>
              <Box textAlign="center">
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Browse free photos
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Powered by Unsplash
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={onInsertFromUnsplash}
                sx={{ textTransform: 'none' }}>
                Browse photos
              </Button>
            </Stack>
          </TabPanel>
        )}

        {/* AI Tab */}
        {onInsertFromAI && (
          <TabPanel value={tabValue} index={onInsertFromUnsplash ? 3 : 2}>
            <Stack spacing={2}>
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Describe the image..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.metaKey && aiPrompt.trim() && !isGenerating) {
                      setIsGenerating(true);
                      onInsertFromAI(aiPrompt.trim()).finally(() => {
                        setIsGenerating(false);
                        setAiPrompt('');
                      });
                    }
                  }}
                  disabled={isGenerating}
                  size="small"
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}>
                  Example: &#34;A sunset over mountains with dramatic clouds&rdquo;
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                startIcon={
                  isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />
                }
                onClick={() => {
                  if (aiPrompt.trim()) {
                    setIsGenerating(true);
                    onInsertFromAI(aiPrompt.trim()).finally(() => {
                      setIsGenerating(false);
                      setAiPrompt('');
                    });
                  }
                }}
                disabled={!aiPrompt.trim() || isGenerating}
                sx={{ textTransform: 'none' }}>
                {isGenerating ? 'Generating...' : 'Generate image'}
              </Button>
            </Stack>
          </TabPanel>
        )}
      </Box>
      {children}
    </Paper>
  );
};
