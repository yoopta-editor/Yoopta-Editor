import { useCallback, useEffect, useMemo, useState } from 'react';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import type { TableCellElement } from '@yoopta/table';
import { TableCommands } from '@yoopta/table';
import { ArrowDown, ArrowUp, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { Editor, Element, Path } from 'slate';

import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

type TableControlsProps = {
  blockId: string;
};

type HoverState = {
  cell: TableCellElement;
  path: Path;
  rowIndex: number;
  colIndex: number;
  rect: DOMRect;
  isFirstRow: boolean;
  isLastRow: boolean;
  isFirstColumn: boolean;
  isLastColumn: boolean;
} | null;

export const TableControls = ({ blockId }: TableControlsProps) => {
  const editor = useYooptaEditor();
  const slate = useMemo(() => Blocks.getBlockSlate(editor, { id: blockId }), [blockId, editor]);
  const [hoverState, setHoverState] = useState<HoverState>(null);
  const [tableRect, setTableRect] = useState<DOMRect | null>(null);

  // Track table dimensions
  useEffect(() => {
    const tableElement = document.querySelector(`[data-yoopta-block-id="${blockId}"]`);
    if (!tableElement) return;

    const updateTableRect = () => {
      setTableRect(tableElement.getBoundingClientRect());
    };

    updateTableRect();

    const resizeObserver = new ResizeObserver(updateTableRect);
    resizeObserver.observe(tableElement);

    window.addEventListener('scroll', updateTableRect, true);
    window.addEventListener('resize', updateTableRect);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateTableRect, true);
      window.removeEventListener('resize', updateTableRect);
    };
  }, [blockId]);

  // Track cell hover
  useEffect(() => {
    const tableElement = document.querySelector(`[data-yoopta-block-id="${blockId}"]`);
    if (!tableElement || !slate) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cellElement = target.closest('[data-yoopta-element-id]');

      if (!cellElement) {
        setHoverState(null);
        return;
      }

      const elementId = cellElement.getAttribute('data-yoopta-element-id');
      if (!elementId) {
        setHoverState(null);
        return;
      }

      const cellEntries = Array.from(
        Editor.nodes(slate, {
          match: (n: any) => Element.isElement(n) && n.id === elementId,
        }),
      );

      if (cellEntries.length === 0) {
        setHoverState(null);
        return;
      }

      const [cell, path] = cellEntries[0] as [TableCellElement, Path];
      const rowIndex = path[path.length - 2];
      const colIndex = path[path.length - 1];

      // Get table info
      const tableEntries = Array.from(
        Editor.nodes(slate, {
          match: (n: any) => n.type === 'table',
        }),
      );

      if (tableEntries.length === 0) return;

      const [tableNode] = tableEntries[0];
      const totalRows = tableNode.children.length;

      // Get total columns from first row
      const firstRow = tableNode.children[0];
      const totalColumns = firstRow.children.length;

      const rect = cellElement.getBoundingClientRect();

      setHoverState({
        cell,
        path,
        rowIndex,
        colIndex,
        rect,
        isFirstRow: rowIndex === 0,
        isLastRow: rowIndex === totalRows - 1,
        isFirstColumn: colIndex === 0,
        isLastColumn: colIndex === totalColumns - 1,
      });
    };

    const handleMouseLeave = () => {
      setHoverState(null);
    };

    tableElement.addEventListener('mousemove', handleMouseMove);
    tableElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      tableElement.removeEventListener('mousemove', handleMouseMove);
      tableElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [blockId, slate]);

  const handleAddRowBelow = useCallback(() => {
    if (!hoverState) return;
    TableCommands.insertTableRow(editor, blockId, {
      at: hoverState.rowIndex + 1,
    });
  }, [editor, blockId, hoverState]);

  const handleAddColumnRight = useCallback(() => {
    if (!hoverState) return;
    TableCommands.insertTableColumn(editor, blockId, {
      at: hoverState.colIndex + 1,
    });
  }, [editor, blockId, hoverState]);

  const handleDeleteRow = useCallback(() => {
    if (!hoverState) return;
    TableCommands.deleteTableRow(editor, blockId, {
      at: hoverState.rowIndex,
    });
    setHoverState(null);
  }, [editor, blockId, hoverState]);

  const handleDeleteColumn = useCallback(() => {
    if (!hoverState) return;
    TableCommands.deleteTableColumn(editor, blockId, {
      at: hoverState.colIndex,
    });
    setHoverState(null);
  }, [editor, blockId, hoverState]);

  const handleAddRowAbove = useCallback(() => {
    if (!hoverState) return;
    TableCommands.insertTableRow(editor, blockId, {
      at: hoverState.rowIndex,
    });
  }, [editor, blockId, hoverState]);

  const handleAddColumnLeft = useCallback(() => {
    if (!hoverState) return;
    TableCommands.insertTableColumn(editor, blockId, {
      at: hoverState.colIndex,
    });
  }, [editor, blockId, hoverState]);

  if (!hoverState || !tableRect) return null;

  const cellLeft = hoverState.rect.left - tableRect.left;
  const cellTop = hoverState.rect.top - tableRect.top;
  const cellWidth = hoverState.rect.width;
  const cellHeight = hoverState.rect.height;

  return (
    <>
      {hoverState.isLastRow && (
        <div
          className="absolute z-20 pointer-events-auto"
          style={{
            left: 0,
            top: cellTop + cellHeight,
            width: tableRect.width,
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-full bg-primary/10 hover:bg-primary/20 border-t-2 border-primary/30 rounded-none"
            onClick={handleAddRowBelow}>
            <Plus className="h-4 w-4 text-primary" />
          </Button>
        </div>
      )}

      {hoverState.isLastColumn && (
        <div
          className="absolute z-20 pointer-events-auto"
          style={{
            left: cellLeft + cellWidth,
            top: cellTop,
            width: '20px',
            height: cellHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Button
            variant="ghost"
            size="sm"
            className="h-full w-6 bg-primary/10 hover:bg-primary/20 border-l-2 border-primary/30 rounded-none"
            onClick={handleAddColumnRight}>
            <Plus className="h-4 w-4 text-primary" />
          </Button>
        </div>
      )}

      {hoverState.isFirstColumn && (
        <div
          className="absolute z-20 pointer-events-auto"
          style={{
            left: cellLeft - 24,
            top: cellTop,
            width: '20px',
            height: cellHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-full w-5 bg-muted/80 hover:bg-muted rounded-sm p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="left">
              <DropdownMenuItem onClick={handleAddRowAbove}>
                <ArrowUp className="mr-2 h-4 w-4" />
                Insert row above
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddRowBelow}>
                <ArrowDown className="mr-2 h-4 w-4" />
                Insert row below
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteRow}
                className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete row
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Column Options - показываем на первой строке */}
      {hoverState.isFirstRow && (
        <div
          className="absolute z-20 pointer-events-auto"
          style={{
            left: cellLeft,
            top: cellTop - 24,
            width: cellWidth,
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-full bg-muted/80 hover:bg-muted rounded-sm p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="top">
              <DropdownMenuItem onClick={handleAddColumnLeft}>
                <ArrowUp className="mr-2 h-4 w-4 rotate-[-90deg]" />
                Insert column left
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddColumnRight}>
                <ArrowDown className="mr-2 h-4 w-4 rotate-[-90deg]" />
                Insert column right
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteColumn}
                className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
};
