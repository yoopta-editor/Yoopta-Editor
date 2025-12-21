import { useRef, useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { ImageUploadProgress, ImageUploadPreview } from '@yoopta/image';
import { ImageIcon, LinkIcon, Loader2, Sparkles, Upload } from 'lucide-react';

import { ImagePlaceholderUnsplash } from './image-placeholder-unsplash';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { cn } from '../../../utils';

type ImagePlaceholderProps = {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInsertUrl: (url: string) => void;
  onInsertFromUnsplash?: () => void;
  onInsertFromAI?: (prompt: string) => void;
  className?: string;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
  preview: ImageUploadPreview | null;
  progress: ImageUploadProgress | null;
  isUploading: boolean;
};

// Preview Image Component
type ImagePreviewProps = {
  preview: ImageUploadPreview;
};

const ImagePreview = ({ preview }: ImagePreviewProps) => {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        width: preview.width,
        height: preview.height,
      }}>
      <img
        src={preview.url}
        alt="Preview"
        className="h-full w-full object-cover object-center"
        style={{
          width: preview.width,
          height: preview.height,
        }}
        draggable={false}
      />
    </div>
  );
};

// Upload Progress Component
type ImageUploadProgressProps = {
  progress: ImageUploadProgress;
};

const ImageUploadProgressOverlay = ({ progress }: ImageUploadProgressProps) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm p-6">
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-white">Uploading...</span>
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
};

// Upload Form Component
type ImageUploadFormProps = {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasPreview: boolean;
};

const ImageUploadForm = ({ onUpload, hasPreview }: ImageUploadFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (hasPreview) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-white">Image preview</p>
          <p className="text-xs text-white/80">Uploading your image...</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="rounded-lg bg-muted p-3">
        <ImageIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">Upload an image</p>
        <p className="text-xs text-muted-foreground">Click or drag and drop</p>
      </div>
      <Button onClick={() => fileInputRef.current?.click()}>Choose file</Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="hidden"
      />
    </div>
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
    <div className="mt-4 space-y-3">
      <Input
        placeholder="Paste image URL..."
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && urlInput.trim()) {
            handleSubmit();
          }
        }}
      />
      <Button className="w-full" onClick={handleSubmit} disabled={!urlInput.trim()}>
        Embed image
      </Button>
    </div>
  );
};

// AI Form Component
type ImageAIFormProps = {
  onInsertFromAI: (prompt: string) => void;
};

const ImageAIForm = ({ onInsertFromAI }: ImageAIFormProps) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = () => {
    if (aiPrompt.trim() && !isGenerating) {
      setIsGenerating(true);
      onInsertFromAI(aiPrompt.trim());
      setIsGenerating(false);
      setAiPrompt('');
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="space-y-2">
        <Input
          placeholder="Describe the image..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          disabled={isGenerating}
        />
        <p className="text-xs text-muted-foreground">
          Example: &quot;A sunset over mountains with dramatic clouds&rdquo;
        </p>
      </div>
      <Button
        className="w-full gap-2"
        onClick={handleSubmit}
        disabled={!aiPrompt.trim() || isGenerating}>
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate image
          </>
        )}
      </Button>
    </div>
  );
};

// Tabs Container Component
type ImagePlaceholderTabsProps = {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInsertUrl: (url: string) => void;
  onInsertFromUnsplash?: () => void;
  onInsertFromAI?: (prompt: string) => void;
  hasPreview: boolean;
};

const ImagePlaceholderTabs = ({
  onUpload,
  onInsertUrl,
  onInsertFromUnsplash,
  onInsertFromAI,
  hasPreview,
}: ImagePlaceholderTabsProps) => {
  return (
    <div className={cn('relative z-10 p-4', hasPreview && 'min-h-[300px] flex flex-col')}>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList
          className={cn(
            'grid w-full grid-cols-4',
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
          {onInsertFromUnsplash && (
            <TabsTrigger value="unsplash" className="gap-1.5">
              <svg className="h-3.5 w-3.5" viewBox="0 0 32 32" fill="currentColor">
                <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" />
              </svg>
              Unsplash
            </TabsTrigger>
          )}
          {onInsertFromAI && (
            <TabsTrigger value="ai" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              AI
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <ImageUploadForm onUpload={onUpload} hasPreview={hasPreview} />
        </TabsContent>

        <TabsContent value="link">
          <ImageLinkForm onInsertUrl={onInsertUrl} />
        </TabsContent>

        {onInsertFromUnsplash && (
          <ImagePlaceholderUnsplash onInsertFromUnsplash={onInsertFromUnsplash} />
        )}

        {onInsertFromAI && (
          <TabsContent value="ai">
            <ImageAIForm onInsertFromAI={onInsertFromAI} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

// Main Component
export const ImagePlaceholder = ({
  onUpload,
  onInsertUrl,
  onInsertFromUnsplash,
  onInsertFromAI,
  className,
  attributes,
  children,
  preview,
  progress,
  isUploading,
}: ImagePlaceholderProps) => {
  const hasPreview = preview !== null && !!preview.url;
  const showUploadProgress = isUploading && progress;

  return (
    <div
      className={cn(
        'relative rounded-lg border bg-background overflow-hidden',
        hasPreview && 'min-h-[300px]',
        className,
      )}
      {...attributes}
      contentEditable={false}>
      {hasPreview && <ImagePreview preview={preview} />}

      {!hasPreview && (
        <ImagePlaceholderTabs
          onUpload={onUpload}
          onInsertUrl={onInsertUrl}
          onInsertFromUnsplash={onInsertFromUnsplash}
          onInsertFromAI={onInsertFromAI}
          hasPreview={hasPreview}
        />
      )}

      {showUploadProgress && progress && <ImageUploadProgressOverlay progress={progress} />}
      {children}
    </div>
  );
};
