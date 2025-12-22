import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import { TABLE_CELLS_IN_SELECTION } from '@yoopta/table';
import { Heading, Merge, Palette, Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';

import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

type TableMultiSelectionToolbarProps = {
  blockId: string;
};

// Utility для debounce
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const TableMultiSelectionToolbar = ({ blockId }: TableMultiSelectionToolbarProps) => {
  const editor = useYooptaEditor();
  const slate = useMemo(() => Blocks.getBlockSlate(editor, { id: blockId }), [blockId, editor]);
  const [selectedCells, setSelectedCells] = useState<any[]>([]);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const selection = slate ? TABLE_CELLS_IN_SELECTION.get(slate) : [];

  // Calculate position based on selection
  const calculatePosition = useCallback(() => {
    if (!slate || !selection || selection.length <= 1) {
      setPosition(null);
      return;
    }

    // Calculate bounding box of all selected cells
    let minTop = Infinity;
    let maxBottom = -Infinity;
    let minLeft = Infinity;
    let maxRight = -Infinity;
    let hasValidRect = false;

    for (const [, path] of selection) {
      const cellRect = Elements.getElementRect(slate, {
        anchor: { path, offset: 0 },
        focus: { path, offset: 0 },
      });

      if (!cellRect) continue;

      hasValidRect = true;
      const { top, bottom, left, right } = cellRect.domRect;

      minTop = Math.min(minTop, top);
      maxBottom = Math.max(maxBottom, bottom);
      minLeft = Math.min(minLeft, left);
      maxRight = Math.max(maxRight, right);
    }

    if (!hasValidRect) {
      setPosition(null);
      return;
    }

    // Calculate toolbar dimensions (approximate)
    const toolbarHeight = 40;
    const toolbarGap = 8;

    // Calculate center horizontally
    const centerX = (minLeft + maxRight) / 2;

    // Try to place above selection
    let finalTop = minTop - toolbarHeight - toolbarGap;

    // Check viewport boundaries
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportTop = scrollY + 60; // Leave some space for fixed headers

    // If toolbar would be outside viewport, place below
    if (finalTop < viewportTop) {
      finalTop = maxBottom + toolbarGap;
    }

    // Ensure toolbar doesn't go off screen horizontally
    const toolbarWidth = toolbarRef.current?.offsetWidth || 300;
    const halfWidth = toolbarWidth / 2;
    const viewportWidth = window.innerWidth;

    let finalLeft = centerX;

    // Constrain to viewport
    if (finalLeft - halfWidth < 10) {
      finalLeft = halfWidth + 10;
    } else if (finalLeft + halfWidth > viewportWidth - 10) {
      finalLeft = viewportWidth - halfWidth - 10;
    }

    setPosition({
      top: finalTop,
      left: finalLeft,
    });
  }, [slate, selection]);

  // Update position when selection changes
  useEffect(() => {
    if (!selection || selection.length <= 1) {
      setSelectedCells([]);
      setPosition(null);
      return;
    }

    setSelectedCells(selection);
    calculatePosition();
  }, [selection, calculatePosition]);

  // Update position on scroll/resize (debounced)
  useEffect(() => {
    if (!selection || selection.length <= 1) return;

    const debouncedCalculate = debounce(calculatePosition, 10);

    window.addEventListener('scroll', debouncedCalculate, true);
    window.addEventListener('resize', debouncedCalculate);

    return () => {
      window.removeEventListener('scroll', debouncedCalculate, true);
      window.removeEventListener('resize', debouncedCalculate);
    };
  }, [calculatePosition, selection]);

  if (!position || selectedCells.length <= 1) return null;

  return createPortal(
    <div
      ref={toolbarRef}
      className="fixed z-50 -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}>
      <div className="flex items-center gap-1 rounded-lg border bg-background/95 p-1 shadow-lg backdrop-blur-sm">
        <TooltipProvider delayDuration={0}>
          <div className="px-2 py-1 text-xs text-muted-foreground font-medium">
            {selectedCells.length} cells
          </div>

          <Separator orientation="vertical" className="h-4" />

          {/* Merge Cells */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  // TableCommands.mergeCells(selectedCells);
                }}>
                <Merge className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Merge cells</TooltipContent>
          </Tooltip>

          {/* Convert to Header */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  // TableCommands.toggleHeaderForCells(selectedCells);
                }}>
                <Heading className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle header</TooltipContent>
          </Tooltip>

          {/* Background Color */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  // Show color picker
                }}>
                <Palette className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Background color</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-4" />

          {/* Clear cells */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => {
                  // TableCommands.clearCells(selectedCells);
                }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear cells</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>,
    document.body,
  );
};
