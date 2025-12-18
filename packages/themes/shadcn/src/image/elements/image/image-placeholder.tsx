import { useRef, useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { ImageIcon, LinkIcon, Loader2, Sparkles, Upload } from 'lucide-react';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { cn } from '../../../utils';
import { ImagePlaceholderUnsplash } from './image-placeholder-unsplash';
import { useImageDimensions, useImagePreview, useImageUpload } from '../../hooks';

type ImagePlaceholderProps = {
  onUpload: (file: File) => void;
  onInsertUrl: (url: string) => void;
  onInsertFromUnsplash?: () => void;
  onInsertFromAI?: (prompt: string) => void;
  className?: string;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
};

export const ImagePlaceholder = ({
  onUpload,
  onInsertUrl,
  onInsertFromUnsplash,
  onInsertFromAI,
  className,
  attributes,
  children,
}: ImagePlaceholderProps) => {
  const [urlInput, setUrlInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { getDimensions } = useImageDimensions();
  const { preview, generatePreview, clearPreview } = useImagePreview();

  const { isUploading, progress, error, result, upload, cancel, reset } = useImageUpload({
    endpoint: '/api/upload',
    method: 'POST',
    headers: { Authorization: 'Bearer your-token' },
    fieldName: 'image',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    onProgress: (progressData) => {
      console.log(`onProgress Uploading: ${progressData.percentage}%`);
    },
    onSuccess: (resultData) => {
      console.log('onSuccess Upload successful:', resultData);
      clearPreview();
    },
    onError: (errorData) => {
      console.error('onError Upload failed:', errorData);
    },
  });

  return (
    <div
      className={cn('rounded-lg border bg-background p-4', className)}
      {...attributes}
      contentEditable={false}>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const prevew = generatePreview(file);
                  console.log('prevew', prevew);
                }
              }}
              className="hidden"
            />
          </div>
        </TabsContent>

        <TabsContent value="link" className="mt-4 space-y-3">
          <Input
            placeholder="Paste image URL..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && urlInput.trim()) {
                onInsertUrl(urlInput.trim());
                setUrlInput('');
              }
            }}
          />
          <Button
            className="w-full"
            onClick={() => {
              if (urlInput.trim()) {
                onInsertUrl(urlInput.trim());
                setUrlInput('');
              }
            }}
            disabled={!urlInput.trim()}>
            Embed image
          </Button>
        </TabsContent>

        {onInsertFromUnsplash && (
          <ImagePlaceholderUnsplash onInsertFromUnsplash={onInsertFromUnsplash} />
        )}

        {onInsertFromAI && (
          <TabsContent value="ai" className="mt-4 space-y-3">
            <div className="space-y-2">
              <Input
                placeholder="Describe the image..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && aiPrompt.trim() && !isGenerating) {
                    setIsGenerating(true);
                    onInsertFromAI(aiPrompt.trim());
                    setIsGenerating(false);
                    setAiPrompt('');
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
              onClick={() => {
                if (aiPrompt.trim()) {
                  setIsGenerating(true);
                  onInsertFromAI(aiPrompt.trim());
                  setIsGenerating(false);
                  setAiPrompt('');
                }
              }}
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
          </TabsContent>
        )}
      </Tabs>
      {children}
    </div>
  );
};
