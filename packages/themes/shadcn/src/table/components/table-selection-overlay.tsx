import { useEffect, useMemo, useState } from 'react';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { TableCommands, TABLE_CELLS_IN_SELECTION } from '@yoopta/table';
import type { TableCellElement } from '@yoopta/table';
import {
  ChevronDown,
  Eraser,
  Merge,
  MoreVertical,
  MoveHorizontal,
  MoveVertical,
  Paintbrush,
  Type,
} from 'lucide-react';
import type { Path } from 'slate';

import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Label } from '../../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Separator } from '../../ui/separator';

type TableSelectionOverlayProps = {
  blockId: string;
};

const BG_COLORS = [
  { label: 'None', value: 'transparent', color: 'transparent' },
  { label: 'Gray', value: 'hsl(var(--muted))', color: 'hsl(var(--muted))' },
  { label: 'Red', value: 'hsl(0 70% 95%)', color: 'hsl(0 70% 95%)' },
  { label: 'Orange', value: 'hsl(30 70% 95%)', color: 'hsl(30 70% 95%)' },
  { label: 'Yellow', value: 'hsl(60 70% 95%)', color: 'hsl(60 70% 95%)' },
  { label: 'Green', value: 'hsl(120 70% 95%)', color: 'hsl(120 70% 95%)' },
  { label: 'Blue', value: 'hsl(210 70% 95%)', color: 'hsl(210 70% 95%)' },
  { label: 'Purple', value: 'hsl(270 70% 95%)', color: 'hsl(270 70% 95%)' },
];

const TEXT_COLORS = [
  { label: 'Default', value: 'inherit', color: 'currentColor' },
  { label: 'Gray', value: 'hsl(var(--muted-foreground))', color: 'hsl(var(--muted-foreground))' },
  { label: 'Red', value: 'hsl(0 70% 50%)', color: 'hsl(0 70% 50%)' },
  { label: 'Orange', value: 'hsl(30 70% 50%)', color: 'hsl(30 70% 50%)' },
  { label: 'Yellow', value: 'hsl(60 70% 40%)', color: 'hsl(60 70% 40%)' },
  { label: 'Green', value: 'hsl(120 70% 40%)', color: 'hsl(120 70% 40%)' },
  { label: 'Blue', value: 'hsl(210 70% 50%)', color: 'hsl(210 70% 50%)' },
  { label: 'Purple', value: 'hsl(270 70% 50%)', color: 'hsl(270 70% 50%)' },
];

export const TableSelectionOverlay = ({ blockId }: TableSelectionOverlayProps) => {
  const editor = useYooptaEditor();
  const slate = useMemo(() => Blocks.getBlockSlate(editor, { id: blockId }), [blockId, editor]);
  const [selectionRect, setSelectionRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  // Save selected cells to prevent losing them when popover opens
  const [savedSelectedCells, setSavedSelectedCells] = useState<[TableCellElement, Path][]>([]);

  const selectedCells = slate ? TABLE_CELLS_IN_SELECTION.get(slate) : [];

  // Update saved cells when selection changes
  useEffect(() => {
    if (selectedCells && selectedCells.length > 0) {
      setSavedSelectedCells(selectedCells);
    }
  }, [selectedCells]);

  // Use saved cells for operations
  const cellsToUse =
    Array.isArray(selectedCells) && selectedCells?.length > 0 ? selectedCells : savedSelectedCells;

  useEffect(() => {
    if (!slate || !cellsToUse || cellsToUse.length <= 1) {
      setSelectionRect(null);
      return;
    }

    const tableElement = document.querySelector(`[data-yoopta-block-id="${blockId}"]`);
    if (!tableElement) {
      setSelectionRect(null);
      return;
    }

    const tableRect = tableElement.getBoundingClientRect();

    let minTop = Infinity;
    let maxBottom = -Infinity;
    let minLeft = Infinity;
    let maxRight = -Infinity;

    for (const [cell] of cellsToUse) {
      const cellEl = document.querySelector(
        `[data-yoopta-block-id="${blockId}"] [data-yoopta-element-id="${cell.id}"]`,
      );

      if (!cellEl) continue;

      const cellRect = cellEl.getBoundingClientRect();
      if (!cellRect) continue;

      const { top, bottom, left, right } = cellRect;
      minTop = Math.min(minTop, top);
      maxBottom = Math.max(maxBottom, bottom);
      minLeft = Math.min(minLeft, left);
      maxRight = Math.max(maxRight, right);
    }

    if (minTop === Infinity) {
      setSelectionRect(null);
      return;
    }

    setSelectionRect({
      top: minTop - tableRect.top,
      left: minLeft - tableRect.left,
      width: maxRight - minLeft,
      height: maxBottom - minTop,
    });
  }, [slate, cellsToUse, blockId]);

  useEffect(() => {
    if (!cellsToUse || cellsToUse.length <= 1) return;

    const handleUpdate = () => {
      setSelectionRect((prev) => (prev ? { ...prev } : null));
    };

    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [cellsToUse]);

  const mergeCells = () => {
    if (!editor || cellsToUse.length <= 1) return;
    TableCommands.mergeCells(editor, blockId, {
      cells: cellsToUse,
    });

    setIsOptionsOpen(false);
  };

  const clearContents = () => {
    if (!editor || cellsToUse.length === 0) return;
    TableCommands.clearContents(editor, blockId, {
      cells: cellsToUse,
    });

    setIsOptionsOpen(false);
  };

  const setBackgroundColor = (color: string) => {
    console.log('Background color:', color, cellsToUse);
    // TODO: Update backgroundColor for all selected cells
  };

  const setTextColor = (color: string) => {
    console.log('Text color:', color, cellsToUse);
    // TODO: Update text color for all selected cells
  };

  const setHorizontalAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    console.log('Horizontal align:', align, cellsToUse);
    // TODO: Update alignment for all selected cells
  };

  const setVerticalAlign = (align: 'top' | 'middle' | 'bottom') => {
    console.log('Vertical align:', align, cellsToUse);
    // TODO: Update vertical alignment for all selected cells
  };

  if (!selectionRect) return null;

  return (
    <>
      {/* Selection overlay */}
      <div
        className="pointer-events-none absolute z-10"
        style={{
          top: `${selectionRect.top}px`,
          left: `${selectionRect.left}px`,
          width: `${selectionRect.width}px`,
          height: `${selectionRect.height}px`,
          border: '2px solid hsl(var(--primary))',
          backgroundColor: 'hsl(var(--primary) / 0.05)',
          borderRadius: '2px',
        }}
      />

      <div
        className="absolute z-20 pointer-events-auto"
        style={{
          top: `${selectionRect.top + selectionRect.height / 2}px`,
          left: `${selectionRect.left + selectionRect.width}px`,
          transform: 'translate(-50%, -50%)', // Center on the border
        }}>
        <Popover open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-4 w-4 rounded-full shadow-lg bg-primary hover:bg-primary/90"
              onMouseDown={(e) => e.preventDefault()}>
              <MoreVertical className="h-3 w-3 text-primary-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start" side="right">
            <div className="space-y-3">
              {/* Merge cells */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={mergeCells}
                disabled={cellsToUse.length <= 1}>
                <Merge className="h-4 w-4" />
                Merge cells
              </Button>

              <Separator />

              {/* Color dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Color</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Paintbrush className="h-4 w-4" />
                        Select color
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    {/* Background color submenu */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Paintbrush className="mr-2 h-4 w-4" />
                        Background color
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {BG_COLORS.map((color) => (
                          <DropdownMenuItem
                            key={color.value}
                            onClick={() => setBackgroundColor(color.value)}>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-4 w-4 rounded border"
                                style={{ backgroundColor: color.color }}
                              />
                              {color.label}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* Text color submenu */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Type className="mr-2 h-4 w-4" />
                        Text color
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {TEXT_COLORS.map((color) => (
                          <DropdownMenuItem
                            key={color.value}
                            onClick={() => setTextColor(color.value)}>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-4 w-4 rounded border flex items-center justify-center text-xs font-bold"
                                style={{ color: color.color }}>
                                A
                              </div>
                              {color.label}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Alignment dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Alignment</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <MoveHorizontal className="h-4 w-4" />
                        Select alignment
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    {/* Horizontal alignment submenu */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <MoveHorizontal className="mr-2 h-4 w-4" />
                        Horizontal
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setHorizontalAlign('left')}>
                          Left
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setHorizontalAlign('center')}>
                          Center
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setHorizontalAlign('right')}>
                          Right
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setHorizontalAlign('justify')}>
                          Justify
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* Vertical alignment submenu */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <MoveVertical className="mr-2 h-4 w-4" />
                        Vertical
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setVerticalAlign('top')}>
                          Top
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setVerticalAlign('middle')}>
                          Middle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setVerticalAlign('bottom')}>
                          Bottom
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Separator />

              {/* Clear contents */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={clearContents}>
                <Eraser className="h-4 w-4" />
                Clear contents
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
