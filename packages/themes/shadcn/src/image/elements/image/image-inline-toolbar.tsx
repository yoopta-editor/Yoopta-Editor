import { useEffect, useState } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Copy, Download, RotateCw, Trash2 } from 'lucide-react';

import { ImageInlineToolbarSettings } from './image-inline-toolbar-settings';
import { Button } from '../../../ui/button';
import { Separator } from '../../../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip';
import { cn } from '../../../utils';
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

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'absolute left-1/2 -translate-x-1/2 z-10',
        'flex items-center gap-1 rounded-lg border bg-white/95 p-1 shadow-lg backdrop-blur-sm',
        'transition-all duration-200 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      )}
      style={{
        bottom: '100%',
        marginBottom: '8px',
      }}>
      <TooltipProvider delayDuration={0}>
        <div className="flex items-center gap-0.5 border-r pr-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={elementProps.alignment === 'left' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => onUpdate({ alignment: 'left' })}>
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={elementProps.alignment === 'center' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => onUpdate({ alignment: 'center' })}>
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={elementProps.alignment === 'right' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => onUpdate({ alignment: 'right' })}>
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align right</TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onReplace}>
              <RotateCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Replace</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-4" />

        <ImageInlineToolbarSettings
          fit={elementProps.fit ?? 'contain'}
          alt={elementProps.alt || ''}
          borderRadius={elementProps.borderRadius ?? 0}
          onUpdate={onUpdate}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
