import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import type { SlateElement } from '@yoopta/editor';
import {
  TableCellElement,
  TABLE_CELLS_IN_SELECTION,
  TABLE_SLATE_TO_SELECTION_SET,
} from '@yoopta/table';
import { TableCommands } from '@yoopta/table';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  MoreHorizontal,
  Plus,
  Trash2,
} from 'lucide-react';
import { Editor, Element } from 'slate';
import type { Path } from 'slate';

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

type HoveredCell = {
  cell: TableCellElement;
  path: Path;
  rowIndex: number;
  colIndex: number;
  rect: DOMRect;
  totalRows: number;
  totalColumns: number;
};

export const TableControls = ({ blockId }: TableControlsProps) => {
  const editor = useYooptaEditor();
  const slate = useMemo(() => Blocks.getBlockSlate(editor, { id: blockId }), [blockId, editor]);
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null);
  const [tableRect, setTableRect] = useState<DOMRect | null>(null);
  const [containerPadding, setContainerPadding] = useState({ top: 0, left: 0 });
  const [isOverControls, setIsOverControls] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const tableContainer = document.querySelector(
      `[data-yoopta-block-id="${blockId}"][data-table-container]`,
    ) as HTMLElement;

    if (!tableContainer) return;

    const tableElement = tableContainer.querySelector('table');
    if (!tableElement) return;

    const updateRects = () => {
      // Get container padding
      const containerStyles = window.getComputedStyle(tableContainer);
      const paddingTop = parseInt(containerStyles.paddingTop, 10) || 0;
      const paddingLeft = parseInt(containerStyles.paddingLeft, 10) || 0;

      setContainerPadding({ top: paddingTop, left: paddingLeft });

      // Get table rect (the actual table, not container)
      setTableRect(tableElement.getBoundingClientRect());
    };

    updateRects();

    const resizeObserver = new ResizeObserver(updateRects);
    resizeObserver.observe(tableContainer);
    resizeObserver.observe(tableElement);

    window.addEventListener('scroll', updateRects, true);
    window.addEventListener('resize', updateRects);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateRects, true);
      window.removeEventListener('resize', updateRects);
    };
  }, [blockId]);

  // Track cell hover
  useEffect(() => {
    const tableContainer = document.querySelector(
      `[data-yoopta-block-id="${blockId}"][data-table-container]`,
    );

    if (!tableContainer || !slate) return;

    const handleMouseMove = (e: Event) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const mouseEvent = e as MouseEvent;
      const target = mouseEvent.target as HTMLElement;
      const cellElement = target.closest('[data-element-type="table-data-cell"]') as HTMLElement;

      if (!cellElement) {
        if (!isOverControls) {
          setHoveredCell(null);
        }
        return;
      }

      const elementId = cellElement.getAttribute('data-yoopta-element-id');
      if (!elementId) {
        if (!isOverControls) {
          setHoveredCell(null);
        }
        return;
      }

      const cellEntries = Array.from(
        Editor.nodes<TableCellElement>(slate, {
          at: [0],
          match: (n) => {
            if (!Element.isElement(n)) return false;
            const element = n as TableCellElement;
            return (
              element.type === 'table-data-cell' && 'id' in element && element.id === elementId
            );
          },
          mode: 'all',
        }),
      );

      if (cellEntries.length === 0) {
        if (!isOverControls) {
          setHoveredCell(null);
        }
        return;
      }

      const [cell, path] = cellEntries[0];
      const rowIndex = path[path.length - 2];
      const colIndex = path[path.length - 1];

      const tableEntries = Array.from(
        Editor.nodes<SlateElement>(slate, {
          at: [0],
          match: (n) => {
            if (!Element.isElement(n)) return false;
            const element = n as SlateElement;
            return element.type === 'table';
          },
          mode: 'lowest',
        }),
      );

      if (tableEntries.length === 0) return;

      const [tableNode] = tableEntries[0];
      if (!Element.isElement(tableNode)) return;

      const totalRows = tableNode.children.length;
      const firstRow = tableNode.children[0];
      if (!Element.isElement(firstRow)) return;

      const totalColumns = firstRow.children.length;

      const rect = cellElement.getBoundingClientRect();

      setHoveredCell({
        cell,
        path,
        rowIndex,
        colIndex,
        rect,
        totalRows,
        totalColumns,
      });
    };

    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        if (!isOverControls) {
          setHoveredCell(null);
        }
      }, 100);
    };

    tableContainer.addEventListener('mousemove', handleMouseMove as EventListener);
    tableContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      tableContainer.removeEventListener('mousemove', handleMouseMove as EventListener);
      tableContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [blockId, slate, isOverControls]);

  const handleInsertRowAbove = useCallback(() => {
    if (!hoveredCell) return;
    const rowPath = hoveredCell.path.slice(0, -1);
    TableCommands.insertTableRow(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: rowPath,
      insertMode: 'before',
    });
  }, [editor, blockId, hoveredCell]);

  const handleInsertRowBelow = useCallback(() => {
    if (!hoveredCell) return;
    const rowPath = hoveredCell.path.slice(0, -1);
    TableCommands.insertTableRow(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: rowPath,
      insertMode: 'after',
    });
  }, [editor, blockId, hoveredCell]);

  const handleDeleteRow = useCallback(() => {
    if (!hoveredCell) return;
    const rowPath = hoveredCell.path.slice(0, -1);
    TableCommands.deleteTableRow(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: rowPath,
    });
    setHoveredCell(null);
  }, [editor, blockId, hoveredCell]);

  const handleInsertColumnLeft = useCallback(() => {
    if (!hoveredCell) return;
    TableCommands.insertTableColumn(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: hoveredCell.path,
      insertMode: 'before',
    });
  }, [editor, blockId, hoveredCell]);

  const handleInsertColumnRight = useCallback(() => {
    if (!hoveredCell) return;
    TableCommands.insertTableColumn(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: hoveredCell.path,
      insertMode: 'after',
    });
  }, [editor, blockId, hoveredCell]);

  const handleDeleteColumn = useCallback(() => {
    if (!hoveredCell) return;
    TableCommands.deleteTableColumn(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: hoveredCell.path,
    });
    setHoveredCell(null);
  }, [editor, blockId, hoveredCell]);

  const handleAddRowBelow = useCallback(() => {
    if (!hoveredCell || !slate) return;
    const lastRowPath = [hoveredCell.totalRows - 1];
    TableCommands.insertTableRow(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: lastRowPath,
      insertMode: 'after',
    });
  }, [editor, blockId, hoveredCell, slate]);

  const handleAddColumnRight = useCallback(() => {
    if (!hoveredCell || !slate) return;
    const lastColumnCellPath = [0, 0, hoveredCell.totalColumns - 1];
    TableCommands.insertTableColumn(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: lastColumnCellPath,
      insertMode: 'after',
    });
  }, [editor, blockId, hoveredCell, slate]);

  const handleControlsMouseEnter = useCallback(() => {
    setIsOverControls(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleControlsMouseLeave = useCallback(() => {
    setIsOverControls(false);
    timeoutRef.current = setTimeout(() => {
      setHoveredCell(null);
    }, 100);
  }, []);

  if (!hoveredCell || !tableRect) return null;

  const isFirstRow = hoveredCell.rowIndex === 0;
  const isFirstColumn = hoveredCell.colIndex === 0;
  const isLastRow = hoveredCell.rowIndex === hoveredCell.totalRows - 1;
  const isLastColumn = hoveredCell.colIndex === hoveredCell.totalColumns - 1;

  // Calculate positions relative to table (accounting for padding)
  const cellLeft = hoveredCell.rect.left - tableRect.left;
  const cellTop = hoveredCell.rect.top - tableRect.top;
  const cellWidth = hoveredCell.rect.width;
  const cellHeight = hoveredCell.rect.height;

  return (
    <>
      {/* Row controls */}
      {true && (
        <div
          className="absolute z-20 pointer-events-auto"
          style={{
            left: containerPadding.left,
            top: containerPadding.top + cellTop,
            width: 'auto',
            height: 'auto',
          }}
          onMouseEnter={handleControlsMouseEnter}
          onMouseLeave={handleControlsMouseLeave}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                style={{
                  transform: 'translateY(-50%)',
                  insetInlineStart: '-3px',
                  top: '50%',
                  width: '6px',
                  height: cellHeight / 2,
                  opacity: 1,
                  zIndex: 4,
                  position: 'absolute',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: '#7d7a75',
                  border: '2px solid #191919',
                }}
                onMouseDown={(e) => e.preventDefault()}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="left">
              <DropdownMenuItem onClick={handleInsertRowAbove}>
                <ArrowUp className="mr-2 h-4 w-4" />
                Insert row above
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleInsertRowBelow}>
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

      {/* Column controls */}
      {true && (
        <div
          className="absolute z-20 pointer-events-auto"
          style={{
            left: containerPadding.left + cellLeft,
            top: containerPadding.top - 28,
            width: cellWidth,
            height: 24,
          }}
          onMouseEnter={handleControlsMouseEnter}
          onMouseLeave={handleControlsMouseLeave}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-full w-full bg-muted/80 hover:bg-muted rounded-sm p-0"
                onMouseDown={(e) => e.preventDefault()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="top">
              <DropdownMenuItem onClick={handleInsertColumnLeft}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Insert column left
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleInsertColumnRight}>
                <ArrowRight className="mr-2 h-4 w-4" />
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

      {/* Add column button */}
      {isLastColumn && (
        <div
          className="absolute z-20 pointer-events-auto"
          style={{
            left: containerPadding.left + tableRect.width,
            top: containerPadding.top,
            width: 24,
            height: tableRect.height,
          }}
          onMouseEnter={handleControlsMouseEnter}
          onMouseLeave={handleControlsMouseLeave}>
          <Button
            variant="ghost"
            size="sm"
            className="h-full w-full bg-primary/10 hover:bg-primary/20 border-l-2 border-primary/30 rounded-none p-0"
            onClick={handleAddColumnRight}>
            <Plus className="h-4 w-4 text-primary" />
          </Button>
        </div>
      )}

      {/* Add row button */}
      {isLastRow && (
        <div
          className="absolute z-20 pointer-events-auto"
          style={{
            left: containerPadding.left,
            top: containerPadding.top + tableRect.height,
            width: tableRect.width,
            height: 24,
          }}
          onMouseEnter={handleControlsMouseEnter}
          onMouseLeave={handleControlsMouseLeave}>
          <Button
            variant="ghost"
            size="sm"
            className="h-full w-full bg-primary/10 hover:bg-primary/20 border-t-2 border-primary/30 rounded-none p-0"
            onClick={handleAddRowBelow}>
            <Plus className="h-4 w-4 text-primary" />
          </Button>
        </div>
      )}
    </>
  );
};
