import { useRef, useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import type { VideoUploadPreview, VideoUploadProgress } from '@yoopta/video';
import { parseVideoUrl } from '@yoopta/video';
import { LinkIcon, Loader2, Play, Upload, VideoIcon } from 'lucide-react';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { cn } from '../../../utils';

type VideoPlaceholderProps = {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInsertUrl: (url: string) => void;
  className?: string;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
  preview: VideoUploadPreview | null;
  progress: VideoUploadProgress | null;
  loading: boolean;
};

// Preview Video Component
type VideoPreviewProps = {
  preview: VideoUploadPreview;
};

const VideoPreview = ({ preview }: VideoPreviewProps) => (
  <div className="absolute inset-0 overflow-hidden flex items-center justify-center bg-black/5">
    <video
      src={preview.url}
      className="max-w-full max-h-full object-contain"
      style={{
        maxWidth: preview.width || '100%',
        maxHeight: preview.height || '100%',
      }}
      controls={false}
      muted
      draggable={false}
    />
  </div>
);

// Upload Progress Component
type VideoUploadProgressProps = {
  progress: VideoUploadProgress;
};

const VideoUploadProgressOverlay = ({ progress }: VideoUploadProgressProps) => (
  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm p-6">
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-white">Uploading video...</span>
          <span className="text-white/80">{progress.percentage}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>
            {(progress.loaded / 1024 / 1024).toFixed(2)} MB /{' '}
            {(progress.total / 1024 / 1024).toFixed(2)} MB
          </span>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        </div>
      </div>
    </div>
  </div>
);

// Upload Form Component
type VideoUploadFormProps = {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasPreview: boolean;
};

const VideoUploadForm = ({ onUpload, hasPreview }: VideoUploadFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (hasPreview) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-white">Video preview</p>
          <p className="text-xs text-white/80">Uploading your video...</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={onUpload}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="rounded-lg bg-muted p-3">
        <VideoIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">Upload a video</p>
        <p className="text-xs text-muted-foreground">Click or drag and drop</p>
      </div>
      <Button onClick={() => fileInputRef.current?.click()}>Choose file</Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={onUpload}
        className="hidden"
      />
    </div>
  );
};

// Link Form Component
type VideoLinkFormProps = {
  onInsertUrl: (url: string) => void;
};

const VideoLinkForm = ({ onInsertUrl }: VideoLinkFormProps) => {
  const [urlInput, setUrlInput] = useState('');
  const [isValidProvider, setIsValidProvider] = useState(false);
  const [providerName, setProviderName] = useState<string | null>(null);

  const handleUrlChange = (value: string) => {
    setUrlInput(value);
    if (value.trim()) {
      const parsed = parseVideoUrl(value.trim());
      setIsValidProvider(parsed.isValid);
      setProviderName(parsed.provider ? parsed.provider.charAt(0).toUpperCase() + parsed.provider.slice(1) : null);
    } else {
      setIsValidProvider(false);
      setProviderName(null);
    }
  };

  const handleSubmit = () => {
    if (urlInput.trim()) {
      onInsertUrl(urlInput.trim());
      setUrlInput('');
      setIsValidProvider(false);
      setProviderName(null);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="space-y-2">
        <Input
          placeholder="Paste video URL (YouTube, Vimeo, Dailymotion, Loom, Wistia)..."
          value={urlInput}
          onChange={(e) => handleUrlChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && urlInput.trim() && isValidProvider) {
              handleSubmit();
            }
          }}
        />
        {urlInput.trim() && (
          <div className="text-xs text-muted-foreground">
            {isValidProvider ? (
              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <Play className="h-3 w-3" />
                {providerName} video detected
              </span>
            ) : (
              <span className="text-destructive">Invalid video URL. Supported: YouTube, Vimeo, Dailymotion, Loom, Wistia</span>
            )}
          </div>
        )}
      </div>
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={!urlInput.trim() || !isValidProvider}>
        {isValidProvider ? `Embed ${providerName} video` : 'Embed video'}
      </Button>
    </div>
  );
};

// Tabs Container Component
type VideoPlaceholderTabsProps = {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInsertUrl: (url: string) => void;
  hasPreview: boolean;
};

const VideoPlaceholderTabs = ({
  onUpload,
  onInsertUrl,
  hasPreview,
}: VideoPlaceholderTabsProps) => (
  <div className={cn('relative p-4', hasPreview && 'min-h-[300px] flex flex-col')}>
    <Tabs defaultValue="upload" className="w-full">
      <TabsList
        className={cn(
          'grid w-full grid-cols-2',
          hasPreview && 'bg-background/80 backdrop-blur-sm',
        )}>
        <TabsTrigger value="upload" className="gap-1.5">
          <Upload className="h-3.5 w-3.5" />
          Upload
        </TabsTrigger>
        <TabsTrigger value="link" className="gap-1.5">
          <LinkIcon className="h-3.5 w-3.5" />
          Link
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="mt-4">
        <VideoUploadForm onUpload={onUpload} hasPreview={hasPreview} />
      </TabsContent>

      <TabsContent value="link">
        <VideoLinkForm onInsertUrl={onInsertUrl} />
      </TabsContent>
    </Tabs>
  </div>
);

// Main Component
export const VideoPlaceholder = ({
  onUpload,
  onInsertUrl,
  className,
  attributes,
  children,
  preview,
  progress,
  loading,
}: VideoPlaceholderProps) => {
  const hasPreview = preview !== null && !!preview.url;
  const showUploadProgress = loading && progress;

  return (
    <div
      className={cn(
        'mt-2 relative rounded-lg border bg-background overflow-hidden',
        hasPreview && 'min-h-[300px]',
        className,
      )}
      {...attributes}
      contentEditable={false}>
      {hasPreview && <VideoPreview preview={preview} />}

      {!hasPreview && (
        <VideoPlaceholderTabs
          onUpload={onUpload}
          onInsertUrl={onInsertUrl}
          hasPreview={hasPreview}
        />
      )}

      {showUploadProgress && progress && <VideoUploadProgressOverlay progress={progress} />}
      {children}
    </div>
  );
};

