import { useLayoutEffect, useState } from 'react';
import { FloatingPortal, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';
import { AlignCenter, AlignLeft, AlignRight, Copy, Download, RotateCw, Trash2 } from 'lucide-react';

import { ImageInlineToolbarSettings } from './image-inline-toolbar-settings';
import { Button } from '../../../ui/button';
import { Separator } from '../../../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip';
import { cn } from '../../../utils';
import type { ImageElementProps } from '../../types';

type ImageInlineToolbarProps = {
  referenceRef: React.MutableRefObject<HTMLElement | null>;
  elementProps: ImageElementProps;
  onUpdate: (props: Partial<ImageElementProps>) => void;
  onReplace: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onCopy: () => void;
};

export const ImageInlineToolbar = ({
  referenceRef,
  elementProps,
  onUpdate,
  onReplace,
  onDelete,
  onDownload,
  onCopy,
}: ImageInlineToolbarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

  console.log('image inline toolbar', { isVisible, isReady, referenceRef });

  const { refs, floatingStyles } = useFloating({
    placement: 'top-end',
    strategy: 'absolute',
    middleware: [
      offset(8),
      flip({
        fallbackPlacements: ['bottom-end', 'top-start', 'bottom-start'],
        padding: 10,
      }),
      shift({ padding: 10 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Use useLayoutEffect to set reference before paint
  useLayoutEffect(() => {
    const element = referenceRef.current;
    if (element) {
      refs.setReference(element);
      // Mark as ready after reference is set
      setIsReady(true);
    }
  }, [referenceRef, refs]);

  // Show animation after ready
  useLayoutEffect(() => {
    if (isReady) {
      // Small delay for animation
      const timer = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [isReady]);

  // Don't render until reference is available and ready
  if (!isReady) return null;

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'pointer-events-auto z-50',
          'flex items-center gap-1 rounded-lg border bg-background/95 backdrop-blur-sm p-1 shadow-lg',
          'transition-opacity duration-200 ease-out',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        )}
        style={floatingStyles}>
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
            alt={elementProps.alt ?? ''}
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
    </FloatingPortal>
  );
};
