import { useRef, useState } from 'react';
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
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import type { PluginElementRenderProps } from '@yoopta/editor';
import type { ImageUploadProgress } from '@yoopta/image';

type ImagePlaceholderProps = {
  onUpload: (file: File) => void;
  onInsertUrl: (url: string) => void;
  onInsertFromUnsplash?: () => void;
  onInsertFromAI?: (prompt: string) => Promise<void>;
  preview: string | null;
  progress: ImageUploadProgress | null;
  isUploading: boolean;
  sx?: object;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
};

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

// Preview Image Component
type ImagePreviewProps = {
  preview: string;
};

const ImagePreview = ({ preview }: ImagePreviewProps) => (
  <Box
    sx={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
    }}>
    <img
      src={preview}
      alt="Preview"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
      }}
      draggable={false}
    />
  </Box>
);

// Upload Progress Component
type ImageUploadProgressProps = {
  progress: ImageUploadProgress;
  theme: ReturnType<typeof useTheme>;
};

const ImageUploadProgressOverlay = ({ progress, theme }: ImageUploadProgressProps) => (
  <Box
    sx={{
      position: 'absolute',
      inset: 0,
      zIndex: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      bgcolor: alpha(theme.palette.common.black, 0.7),
      backdropFilter: 'blur(4px)',
      p: 3,
    }}>
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" fontWeight={600} color="white">
            Uploading...
          </Typography>
          <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
            {progress.percentage}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress.percentage}
          sx={{
            height: 8,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.common.white, 0.2),
            '& .MuiLinearProgress-bar': {
              bgcolor: theme.palette.primary.main,
            },
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="white" sx={{ opacity: 0.6 }}>
            {(progress.loaded / 1024 / 1024).toFixed(2)} MB /{' '}
            {(progress.total / 1024 / 1024).toFixed(2)} MB
          </Typography>
          <CircularProgress size={14} sx={{ color: 'white' }} />
        </Box>
      </Stack>
    </Box>
  </Box>
);

// Upload Form Component
type ImageUploadFormProps = {
  onUpload: (file: File) => void;
  hasPreview: boolean;
  theme: ReturnType<typeof useTheme>;
};

const ImageUploadForm = ({ onUpload, hasPreview, theme }: ImageUploadFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (hasPreview) {
    return (
      <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ py: 4 }}>
        <Stack spacing={1} alignItems="center">
          <Typography variant="body2" fontWeight={600} color="white">
            Image preview
          </Typography>
          <Typography variant="caption" color="white" sx={{ opacity: 0.8 }}>
            Uploading your image...
          </Typography>
        </Stack>
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
    );
  }

  return (
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
  );
};

// Link Form Component
type ImageLinkFormProps = {
  onInsertUrl: (url: string) => void;
};

const ImageLinkForm = ({ onInsertUrl }: ImageLinkFormProps) => {
  const [urlInput, setUrlInput] = useState('');

  const handleSubmit = () => {
    if (urlInput.trim()) {
      onInsertUrl(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        placeholder="Paste image URL..."
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && urlInput.trim()) {
            handleSubmit();
          }
        }}
        size="small"
      />
      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={!urlInput.trim()}
        sx={{ textTransform: 'none' }}>
        Embed image
      </Button>
    </Stack>
  );
};

// AI Form Component
type ImageAIFormProps = {
  onInsertFromAI: (prompt: string) => Promise<void>;
};

const ImageAIForm = ({ onInsertFromAI }: ImageAIFormProps) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = () => {
    if (aiPrompt.trim() && !isGenerating) {
      setIsGenerating(true);
      onInsertFromAI(aiPrompt.trim()).finally(() => {
        setIsGenerating(false);
        setAiPrompt('');
      });
    }
  };

  return (
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
              handleSubmit();
            }
          }}
          disabled={isGenerating}
          size="small"
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Example: &#34;A sunset over mountains with dramatic clouds&rdquo;
        </Typography>
      </Box>
      <Button
        fullWidth
        variant="contained"
        startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
        onClick={handleSubmit}
        disabled={!aiPrompt.trim() || isGenerating}
        sx={{ textTransform: 'none' }}>
        {isGenerating ? 'Generating...' : 'Generate image'}
      </Button>
    </Stack>
  );
};

// Main Component
export const ImagePlaceholder = ({
  onUpload,
  onInsertUrl,
  onInsertFromUnsplash,
  onInsertFromAI,
  preview,
  progress,
  isUploading,
  sx,
  attributes,
  children,
}: ImagePlaceholderProps) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const hasPreview = Boolean(preview);
  const showUploadProgress = isUploading && progress;

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
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        minHeight: hasPreview ? 300 : 'auto',
        ...sx,
      }}>
      {hasPreview && preview && <ImagePreview preview={preview} />}

      {!hasPreview && (
        <>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: alpha(theme.palette.action.selected, 0.02),
            }}>
            {tabs.map((tab) => (
              <Tab
                key={tab.label}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                sx={{ textTransform: 'none', minHeight: 48 }}
              />
            ))}
          </Tabs>

          <Box sx={{ p: 3 }}>
            <TabPanel value={tabValue} index={0}>
              <ImageUploadForm onUpload={onUpload} hasPreview={hasPreview} theme={theme} />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <ImageLinkForm onInsertUrl={onInsertUrl} />
            </TabPanel>

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

            {onInsertFromAI && (
              <TabPanel value={tabValue} index={onInsertFromUnsplash ? 3 : 2}>
                <ImageAIForm onInsertFromAI={onInsertFromAI} />
              </TabPanel>
            )}
          </Box>
        </>
      )}

      {showUploadProgress && progress && (
        <ImageUploadProgressOverlay progress={progress} theme={theme} />
      )}

      {children}
    </Paper>
  );
};
