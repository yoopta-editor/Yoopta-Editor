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

type ImagePlaceholderProps = {
  onUpload: (file: File) => void;
  onInsertUrl: (url: string) => void;
  onInsertFromUnsplash?: () => void;
  onInsertFromAI?: (prompt: string) => Promise<void>;
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
