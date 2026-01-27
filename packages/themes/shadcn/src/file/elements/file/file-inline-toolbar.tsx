import { useEffect, useState } from 'react';
import { autoUpdate, inline, offset, shift, useFloating } from '@floating-ui/react';
import copy from 'copy-to-clipboard';
import { Copy, Download, ExternalLink, RotateCw, Trash2 } from 'lucide-react';

import { Button } from '../../../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip';
import { cn } from '../../../utils';
import type { FileElementProps } from '../../types';

type FileInlineToolbarProps = {
  referenceRef: React.MutableRefObject<HTMLElement | null>;
  elementProps: FileElementProps;
  onReplace: () => void;
  onDelete: () => void;
  onDownload?: () => void;
};

export const FileInlineToolbar = ({
  referenceRef,
  elementProps,
  onReplace,
  onDelete,
  onDownload,
}: FileInlineToolbarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    strategy: 'fixed',
    middleware: [offset(8), inline(), shift({ padding: 10 })],
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
    } else if (elementProps.src) {
      const a = document.createElement('a');
      a.href = elementProps.src;
      a.download = elementProps.name ?? `file-${Date.now()}`;
      a.click();
    }
  };

  const handleCopy = () => {
    if (elementProps.src) {
      copy(elementProps.src);
    }
  };

  const handleOpenLink = () => {
    if (elementProps.src) {
      window.open(elementProps.src, '_blank');
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onReplace}>
              <RotateCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Replace</TooltipContent>
        </Tooltip>

        {elementProps.src && (
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

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleOpenLink}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open in new tab</TooltipContent>
            </Tooltip>
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
    </div>
  );
};
