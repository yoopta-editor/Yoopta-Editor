import { useRef } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { useBlockSelected, useElementSelected } from '@yoopta/editor';
import { formatFileSize, getFileType } from '@yoopta/file';
import { Download } from 'lucide-react';

import { FileIcon, getFileTypeStyles } from './file-icons';
import { FileInlineToolbar } from './file-inline-toolbar';
import { Button } from '../../../ui/button';
import { cn } from '../../../utils';
import type { FileElementProps } from '../../types';

type Props = {
  blockId: string;
  onDelete: () => void;
  onReplace: () => void;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
  elementProps: FileElementProps;
};

export const FileRender = ({ blockId, attributes, children, elementProps, onDelete, onReplace }: Props) => {
  const { isElementSelected } = useElementSelected();
  const isBlockSelected = useBlockSelected({ blockId });
  const isSelected = isElementSelected && isBlockSelected;
  const cardRef = useRef<HTMLDivElement | null>(null);

  const { name, format, size, src } = elementProps;
  const displayName = format ? `${name}.${format}` : name ?? 'Untitled file';
  const fileType = getFileType(displayName);
  const typeStyles = getFileTypeStyles(fileType);

  const handleDownload = () => {
    if (!src) return;
    const a = document.createElement('a');
    a.href = src;
    a.download = displayName;
    a.click();
  };

  return (
    <div {...attributes} className="group/file mt-2 relative transition-all w-full">
      <div className="relative" contentEditable={false}>
        <div
          ref={cardRef}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border bg-card transition-all',
            'hover:bg-accent/50',
            isSelected && 'ring-2 ring-primary ring-offset-2',
          )}>
          {/* File Icon */}
          <div className={cn('flex-shrink-0 rounded-lg p-2.5', typeStyles.bgColor)}>
            <FileIcon fileType={fileType} className={cn('h-5 w-5', typeStyles.color)} />
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(size)}</p>
          </div>

          {/* Download Button */}
          {src && (
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-8 w-8 opacity-0 group-hover/file:opacity-100 transition-opacity"
              onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isSelected && (
          <FileInlineToolbar
            referenceRef={cardRef}
            elementProps={elementProps}
            onReplace={onReplace}
            onDelete={onDelete}
            onDownload={handleDownload}
          />
        )}
      </div>
      {children}
    </div>
  );
};
