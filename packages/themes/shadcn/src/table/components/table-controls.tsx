import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import type { SlateElement } from '@yoopta/editor';
import { type TableCellElement } from '@yoopta/table';
import { Editor, Element } from 'slate';
import type { Path } from 'slate';

import { AddColumnButton } from './add-column-button';
import { AddRowButton } from './add-row-button';
import { ColumnControls } from './column-controls';
import { RowControls } from './row-controls';

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
  columnRect: DOMRect;
  rowRect: DOMRect;
};

export const TableControls = ({ blockId }: TableControlsProps) => {
  const editor = useYooptaEditor();
  const slate = useMemo(() => Blocks.getBlockSlate(editor, { id: blockId }), [blockId, editor]);
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [tableRect, setTableRect] = useState<DOMRect | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const [containerPadding, setContainerPadding] = useState({ top: 0, left: 0 });

  const [isOverRowControls, setIsOverRowControls] = useState(false);
  const [isOverColumnControls, setIsOverColumnControls] = useState(false);
  const [isOverAddRowButton, setIsOverAddRowButton] = useState(false);
  const [isOverAddColumnButton, setIsOverAddColumnButton] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rowControlsRef = useRef<HTMLDivElement | null>(null);
  const columnControlsRef = useRef<HTMLDivElement | null>(null);
  const addRowButtonRef = useRef<HTMLDivElement | null>(null);
  const addColumnButtonRef = useRef<HTMLDivElement | null>(null);

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

      // Get container rect (for absolute positioning)
      setContainerRect(tableContainer.getBoundingClientRect());

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
        // Check if mouse is over row controls area
        if (rowControlsRef.current) {
          const controlsRect = rowControlsRef.current.getBoundingClientRect();
          const isOverRowArea =
            mouseEvent.clientX >= controlsRect.left - 10 &&
            mouseEvent.clientX <= controlsRect.right + 10 &&
            mouseEvent.clientY >= controlsRect.top - 10 &&
            mouseEvent.clientY <= controlsRect.bottom + 10;

          if (isOverRowArea) {
            setIsOverRowControls(true);
            return;
          }
        }

        // Check if mouse is over column controls area
        if (columnControlsRef.current) {
          const controlsRect = columnControlsRef.current.getBoundingClientRect();
          const isOverColumnArea =
            mouseEvent.clientX >= controlsRect.left - 10 &&
            mouseEvent.clientX <= controlsRect.right + 10 &&
            mouseEvent.clientY >= controlsRect.top - 10 &&
            mouseEvent.clientY <= controlsRect.bottom + 10;

          if (isOverColumnArea) {
            setIsOverColumnControls(true);
            return;
          }
        }

        // Check if mouse is over add row button area
        if (addRowButtonRef.current) {
          const buttonRect = addRowButtonRef.current.getBoundingClientRect();
          const isOverAddRowArea =
            mouseEvent.clientX >= buttonRect.left - 10 &&
            mouseEvent.clientX <= buttonRect.right + 10 &&
            mouseEvent.clientY >= buttonRect.top - 10 &&
            mouseEvent.clientY <= buttonRect.bottom + 10;

          if (isOverAddRowArea) {
            setIsOverAddRowButton(true);
            return;
          }
        }

        // Check if mouse is over add column button area
        if (addColumnButtonRef.current) {
          const buttonRect = addColumnButtonRef.current.getBoundingClientRect();
          const isOverAddColumnArea =
            mouseEvent.clientX >= buttonRect.left - 10 &&
            mouseEvent.clientX <= buttonRect.right + 10 &&
            mouseEvent.clientY >= buttonRect.top - 10 &&
            mouseEvent.clientY <= buttonRect.bottom + 10;

          if (isOverAddColumnArea) {
            setIsOverAddColumnButton(true);
            return;
          }
        }

        if (
          !isOverRowControls &&
          !isOverColumnControls &&
          !isOverAddRowButton &&
          !isOverAddColumnButton
        ) {
          setHoveredCell(null);
          setHoveredColumn(null);
          setHoveredRow(null);
        }
        return;
      }

      const elementId = cellElement.getAttribute('data-yoopta-element-id');
      if (!elementId) {
        if (
          !isOverRowControls &&
          !isOverColumnControls &&
          !isOverAddRowButton &&
          !isOverAddColumnButton
        ) {
          setHoveredCell(null);
          setHoveredColumn(null);
          setHoveredRow(null);
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
        if (
          !isOverRowControls &&
          !isOverColumnControls &&
          !isOverAddRowButton &&
          !isOverAddColumnButton
        ) {
          setHoveredCell(null);
          setHoveredColumn(null);
          setHoveredRow(null);
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
      const firstRowNode = tableNode.children[0];
      if (!Element.isElement(firstRowNode)) return;

      const totalColumns = firstRowNode.children.length;

      const rect = cellElement.getBoundingClientRect();

      // Get all cells in the column to calculate column width and position
      // Find the first cell in this column (from first row)
      const tableRows = Array.from(tableContainer.querySelectorAll('tr')) as HTMLElement[];
      const firstRowElement = tableRows[0];

      // Default rects (fallback to cell rect)
      const defaultColumnRect = {
        left: rect.left,
        width: rect.width,
        top: rect.top,
        height: rect.height,
      } as DOMRect;
      const defaultRowRect = {
        left: rect.left,
        width: rect.width,
        top: rect.top,
        height: rect.height,
      } as DOMRect;

      if (!firstRowElement) {
        setHoveredCell({
          cell,
          path,
          rowIndex,
          colIndex,
          rect,
          totalRows,
          totalColumns,
          columnRect: defaultColumnRect,
          rowRect: defaultRowRect,
        });
        return;
      }

      const firstRowCells = Array.from(
        firstRowElement.querySelectorAll('[data-element-type="table-data-cell"]'),
      ) as HTMLElement[];

      const firstColumnCell = firstRowCells[colIndex];
      if (!firstColumnCell) {
        setHoveredCell({
          cell,
          path,
          rowIndex,
          colIndex,
          rect,
          totalRows,
          totalColumns,
          columnRect: defaultColumnRect,
          rowRect: defaultRowRect,
        });
        return;
      }

      // Get all cells in this column
      const columnCells: DOMRect[] = [];
      tableRows.forEach((row) => {
        const cells = Array.from(
          row.querySelectorAll('[data-element-type="table-data-cell"]'),
        ) as HTMLElement[];
        if (cells[colIndex]) {
          columnCells.push(cells[colIndex].getBoundingClientRect());
        }
      });

      // Calculate column bounds
      const columnLeft = columnCells.length > 0
        ? Math.min(...columnCells.map((r) => r.left))
        : rect.left;
      const columnRight = columnCells.length > 0
        ? Math.max(...columnCells.map((r) => r.right))
        : rect.right;
      const columnWidth = columnRight - columnLeft;
      const columnTop = columnCells.length > 0
        ? Math.min(...columnCells.map((r) => r.top))
        : rect.top;

      // Get all cells in the row to calculate row height and position
      const currentRow = tableRows[rowIndex];
      if (!currentRow) {
        setHoveredCell({
          cell,
          path,
          rowIndex,
          colIndex,
          rect,
          totalRows,
          totalColumns,
          columnRect: {
            left: columnLeft,
            width: columnWidth,
            top: columnTop,
            height: columnCells[0]?.height ?? rect.height,
          } as DOMRect,
          rowRect: defaultRowRect,
        });
        return;
      }

      const rowCells = Array.from(
        currentRow.querySelectorAll('[data-element-type="table-data-cell"]'),
      ) as HTMLElement[];

      // Calculate row bounds
      const rowCellsRects = rowCells.length > 0
        ? rowCells.map((cellEl) => cellEl.getBoundingClientRect())
        : [rect];
      const rowTop = Math.min(...rowCellsRects.map((r) => r.top));
      const rowBottom = Math.max(...rowCellsRects.map((r) => r.bottom));
      const rowHeight = rowBottom - rowTop;
      const rowLeft = Math.min(...rowCellsRects.map((r) => r.left));


      // Only update if column or row changed
      if (hoveredColumn !== colIndex || hoveredRow !== rowIndex) {
        setHoveredColumn(colIndex);
        setHoveredRow(rowIndex);
        setHoveredCell({
          cell,
          path,
          rowIndex,
          colIndex,
          rect,
          totalRows,
          totalColumns,
          columnRect: {
            left: columnLeft,
            width: columnWidth,
            top: columnTop,
            height: columnCells[0]?.height ?? rect.height,
          } as DOMRect,
          rowRect: {
            left: rowLeft,
            width: Math.max(...rowCellsRects.map((r) => r.right)) - rowLeft,
            top: rowTop,
            height: rowHeight,
          } as DOMRect,
        });
      }
    };

    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        if (
          !isOverRowControls &&
          !isOverColumnControls &&
          !isOverAddRowButton &&
          !isOverAddColumnButton
        ) {
          setHoveredCell(null);
          setHoveredColumn(null);
          setHoveredRow(null);
        }
      }, 150);
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
  }, [
    blockId,
    slate,
    isOverRowControls,
    isOverColumnControls,
    isOverAddRowButton,
    isOverAddColumnButton,
    hoveredColumn,
    hoveredRow,
  ]);

  const handleRowControlsMouseEnter = useCallback(() => {
    setIsOverRowControls(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleRowControlsMouseLeave = useCallback(() => {
    setIsOverRowControls(false);
    timeoutRef.current = setTimeout(() => {
      setHoveredCell(null);
      setHoveredColumn(null);
      setHoveredRow(null);
    }, 150);
  }, []);

  const handleColumnControlsMouseEnter = useCallback(() => {
    setIsOverColumnControls(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleColumnControlsMouseLeave = useCallback(() => {
    setIsOverColumnControls(false);
    timeoutRef.current = setTimeout(() => {
      setHoveredCell(null);
      setHoveredColumn(null);
      setHoveredRow(null);
    }, 150);
  }, []);

  const handleAddRowButtonMouseEnter = useCallback(() => {
    setIsOverAddRowButton(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleAddRowButtonMouseLeave = useCallback(() => {
    setIsOverAddRowButton(false);
    timeoutRef.current = setTimeout(() => {
      setHoveredCell(null);
      setHoveredColumn(null);
      setHoveredRow(null);
    }, 150);
  }, []);

  const handleAddColumnButtonMouseEnter = useCallback(() => {
    setIsOverAddColumnButton(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleAddColumnButtonMouseLeave = useCallback(() => {
    setIsOverAddColumnButton(false);
    timeoutRef.current = setTimeout(() => {
      setHoveredCell(null);
      setHoveredColumn(null);
      setHoveredRow(null);
    }, 150);
  }, []);

  if (!tableRect || !containerRect) return null;

  // Show add buttons only on hover of last row/column
  const showAddRowButton = hoveredCell
    ? hoveredCell.rowIndex === hoveredCell.totalRows - 1
    : false;
  const showAddColumnButton = hoveredCell
    ? hoveredCell.colIndex === hoveredCell.totalColumns - 1
    : false;

  // Column controls position (above the column) - viewport coordinates
  const columnControlsTop = hoveredCell ? hoveredCell.columnRect.top - 32 : 0;
  const columnControlsLeft = hoveredCell ? hoveredCell.columnRect.left : 0;

  // Row controls position (left of the row) - viewport coordinates
  const rowControlsTop = hoveredCell ? hoveredCell.rowRect.top : 0;
  const rowControlsLeft = hoveredCell ? Math.max(0, hoveredCell.rowRect.left - 32) : 0;

  // Add row button position (below the table) - viewport coordinates
  const addRowButtonLeft = containerRect.left + containerPadding.left;
  const addRowButtonTop = containerRect.top + containerPadding.top + tableRect.height;

  // Add column button position (right of the table) - viewport coordinates
  const addColumnButtonLeft = containerRect.left + containerPadding.left + tableRect.width;
  const addColumnButtonTop = containerRect.top + containerPadding.top;

  return (
    <>
      {/* Row controls - rendered in Portal */}
      {hoveredCell && (
        <RowControls
          blockId={blockId}
          rowIndex={hoveredCell.rowIndex}
          path={hoveredCell.path}
          position={{
            left: rowControlsLeft,
            top: rowControlsTop,
            height: hoveredCell.rowRect.height,
          }}
          onMouseEnter={handleRowControlsMouseEnter}
          onMouseLeave={handleRowControlsMouseLeave}
          controlsRef={rowControlsRef}
        />
      )}

      {/* Column controls - rendered in Portal */}
      {hoveredCell && (
        <ColumnControls
          blockId={blockId}
          colIndex={hoveredCell.colIndex}
          path={hoveredCell.path}
          position={{
            left: columnControlsLeft,
            top: columnControlsTop,
            width: hoveredCell.columnRect.width,
          }}
          onMouseEnter={handleColumnControlsMouseEnter}
          onMouseLeave={handleColumnControlsMouseLeave}
          controlsRef={columnControlsRef}
        />
      )}

      {/* Add column button - rendered in Portal */}
      {showAddColumnButton && hoveredCell && (
        <AddColumnButton
          blockId={blockId}
          totalColumns={hoveredCell.totalColumns}
          position={{
            left: addColumnButtonLeft,
            top: addColumnButtonTop,
            height: tableRect.height,
          }}
          onMouseEnter={handleAddColumnButtonMouseEnter}
          onMouseLeave={handleAddColumnButtonMouseLeave}
          buttonRef={addColumnButtonRef}
        />
      )}

      {/* Add row button - rendered in Portal */}
      {showAddRowButton && hoveredCell && (
        <AddRowButton
          blockId={blockId}
          totalRows={hoveredCell.totalRows}
          position={{
            left: addRowButtonLeft,
            top: addRowButtonTop,
            width: tableRect.width,
          }}
          onMouseEnter={handleAddRowButtonMouseEnter}
          onMouseLeave={handleAddRowButtonMouseLeave}
          buttonRef={addRowButtonRef}
        />
      )}
    </>
  );
};
