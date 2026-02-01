import { useEffect, useState } from 'react';
import { autoUpdate, inline, offset, shift, useFloating } from '@floating-ui/react';
import copy from 'copy-to-clipboard';
import { AlignCenter, AlignLeft, AlignRight, Copy, Download, ExternalLink, RotateCw, Trash2 } from 'lucide-react';

import { VideoInlineToolbarSettings } from './video-inline-toolbar-settings';
import { Button } from '../../../ui/button';
import { Separator } from '../../../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip';
import { cn } from '../../../utils';
import type { VideoElementProps } from '../../types';

type VideoInlineToolbarProps = {
  referenceRef: React.MutableRefObject<HTMLElement | null>;
  elementProps: VideoElementProps;
  onUpdate: (props: Partial<VideoElementProps>) => void;
  onReplace: () => void;
  onDelete: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
};

export const VideoInlineToolbar = ({
  referenceRef,
  elementProps,
  onUpdate,
  onReplace,
  onDelete,
  onDownload,
  onCopy,
}: VideoInlineToolbarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const isProviderVideo = elementProps.provider && elementProps.provider.type;
  const hasAlignment = 'alignment' in elementProps;

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    strategy: 'fixed',
    middleware: [
      offset(8),
      inline(),
      shift({ padding: 10 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  useEffect(() => {
    const element = referenceRef.current;
    if (element) {
      refs.setReference(element);
    }
  }, [referenceRef, refs]);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (elementProps.src && !isProviderVideo) {
      // Fallback download for non-provider videos
      const a = document.createElement('a');
      a.href = elementProps.src;
      a.download = `video-${Date.now()}.mp4`;
      a.click();
    }
  };

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else if (elementProps.src) {
      copy(elementProps.src);
    }
  };

  const handleOpenLink = () => {
    if (elementProps.provider?.url) {
      window.open(elementProps.provider.url, '_blank');
    }
  };

  return (
    <div
      ref={refs.setFloating}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'pointer-events-auto',
        'flex items-center gap-1 rounded-lg border bg-background/95 backdrop-blur-sm p-1 shadow-lg',
        'transition-all duration-200 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      )}
      style={floatingStyles}>
      <TooltipProvider delayDuration={0}>
        {hasAlignment && (
          <div className="flex items-center gap-0.5 border-r pr-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={(elementProps as any).alignment === 'left' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdate({ alignment: 'left' } as any)}>
                  <AlignLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align left</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={(elementProps as any).alignment === 'center' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdate({ alignment: 'center' } as any)}>
                  <AlignCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align center</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={(elementProps as any).alignment === 'right' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdate({ alignment: 'right' } as any)}>
                  <AlignRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align right</TooltipContent>
            </Tooltip>
          </div>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onReplace}>
              <RotateCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Replace</TooltipContent>
        </Tooltip>

        {!isProviderVideo && elementProps.src && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy URL</TooltipContent>
            </Tooltip>
          </>
        )}

        {isProviderVideo && elementProps.provider?.url && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleOpenLink}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open in new tab</TooltipContent>
          </Tooltip>
        )}

        {!isProviderVideo && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <VideoInlineToolbarSettings
              fit={elementProps.fit ?? 'contain'}
              settings={elementProps.settings || {
                controls: false,
                loop: false,
                muted: false,
                autoPlay: false,
              }}
              onUpdate={onUpdate}
            />
          </>
        )}
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
    </div >
  );
};

