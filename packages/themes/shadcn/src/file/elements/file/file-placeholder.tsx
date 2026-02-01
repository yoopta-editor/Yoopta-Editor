import { useRef } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import type { FileUploadProgress } from '@yoopta/file';
import { File as FileIcon, Loader2, Upload } from 'lucide-react';

import { Button } from '../../../ui/button';
import { cn } from '../../../utils';

type FilePlaceholderProps = {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
  progress: FileUploadProgress | null;
  loading: boolean;
  accept?: string;
};

// Upload Progress Component
type FileUploadProgressProps = {
  progress: FileUploadProgress;
};

const FileUploadProgressOverlay = ({ progress }: FileUploadProgressProps) => (
  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-background/95 backdrop-blur-sm p-6 rounded-lg border">
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Uploading file...</span>
          <span className="text-muted-foreground">{progress.percentage}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {(progress.loaded / 1024 / 1024).toFixed(2)} MB / {(progress.total / 1024 / 1024).toFixed(2)} MB
          </span>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        </div>
      </div>
    </div>
  </div>
);

// Upload Form Component
type FileUploadFormProps = {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
};

const FileUploadForm = ({ onUpload, accept }: FileUploadFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="rounded-lg bg-muted p-3">
        <FileIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">Upload a file</p>
        <p className="text-xs text-muted-foreground">Click to select a file</p>
      </div>
      <Button onClick={() => fileInputRef.current?.click()} variant="default" className="gap-2">
        <Upload className="h-4 w-4" />
        Choose file
      </Button>
      <input ref={fileInputRef} type="file" accept={accept} onChange={onUpload} className="hidden" />
    </div>
  );
};

// Main Component
export const FilePlaceholder = ({
  onUpload,
  className,
  attributes,
  children,
  progress,
  loading,
  accept,
}: FilePlaceholderProps) => {
  const showUploadProgress = loading && progress;

  return (
    <div
      className={cn('mt-2 relative rounded-lg border bg-background overflow-hidden', className)}
      {...attributes}
      contentEditable={false}>
      <FileUploadForm onUpload={onUpload} accept={accept} />
      {showUploadProgress && progress && <FileUploadProgressOverlay progress={progress} />}
      {children}
    </div>
  );
};
