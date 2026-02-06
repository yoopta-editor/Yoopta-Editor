import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import type { SlateElement } from '@yoopta/editor';
import { type TableCellElement } from '@yoopta/table';
import { Editor, Element } from 'slate';

import { AddColumnButton } from './add-column-button';
import { AddRowButton } from './add-row-button';
import { ColumnControls } from './column-controls';
import { RowControls } from './row-controls';

type TableControlsProps = {
  blockId: string;
};

type HoveredCellInfo = {
  rowIndex: number;
  colIndex: number;
  cellElementId: string;
  totalRows: number;
  totalColumns: number;
};

type ControlPositions = {
  rowControls: { left: number; top: number; height: number } | null;
  columnControls: { left: number; top: number; width: number } | null;
  addRowButton: { left: number; top: number; width: number } | null;
  addColumnButton: { left: number; top: number; height: number } | null;
};

const HIDE_DELAY = 150;

export const TableControls = ({ blockId }: TableControlsProps) => {
  const editor = useYooptaEditor();
  const slate = useMemo(() => Blocks.getBlockSlate(editor, { id: blockId }), [blockId, editor]);

  // Store cell info (indices, not rects) - rects are calculated on demand
  const [hoveredCellInfo, setHoveredCellInfo] = useState<HoveredCellInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [positions, setPositions] = useState<ControlPositions>({
    rowControls: null,
    columnControls: null,
    addRowButton: null,
    addColumnButton: null,
  });

  // Refs for hover tracking to avoid stale closures
  const isOverTableRef = useRef(false);
  const isOverControlsRef = useRef(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoveredCellInfoRef = useRef<HoveredCellInfo | null>(null);

  // Keep ref in sync with state
  hoveredCellInfoRef.current = hoveredCellInfo;

  // Calculate positions from stored cell info
  const recalculatePositions = useCallback(() => {
    const cellInfo = hoveredCellInfoRef.current;
    if (!cellInfo) {
      setPositions({
        rowControls: null,
        columnControls: null,
        addRowButton: null,
        addColumnButton: null,
      });
      return;
    }

    const tableContainer = document.querySelector(
      `[data-yoopta-block-id="${blockId}"][data-table-container]`,
    ) as HTMLElement;
    if (!tableContainer) return;

    // Find the scroll container (div with overflow-x-auto)
    const scrollContainer = tableContainer.querySelector('.overflow-x-auto') as HTMLElement;
    const scrollContainerRect = scrollContainer?.getBoundingClientRect();

    const tableElement = tableContainer.querySelector('table');
    if (!tableElement) return;

    const tableRect = tableElement.getBoundingClientRect();
    const tableRows = Array.from(tableContainer.querySelectorAll('tr'));

    // Get current row element
    const currentRow = tableRows[cellInfo.rowIndex] as HTMLElement | undefined;
    if (!currentRow) return;

    // Get cells in current row for row height calculation
    const rowCells = Array.from(
      currentRow.querySelectorAll('[data-element-type="table-data-cell"]'),
    ) as HTMLElement[];

    if (rowCells.length === 0) return;

    const rowCellRects = rowCells.map((cell) => cell.getBoundingClientRect());
    const rowTop = Math.min(...rowCellRects.map((r) => r.top));
    const rowBottom = Math.max(...rowCellRects.map((r) => r.bottom));
    const rowLeft = Math.min(...rowCellRects.map((r) => r.left));
    const rowHeight = rowBottom - rowTop;

    const columnCells: DOMRect[] = [];

    tableRows.forEach((row) => {
      const cells = Array.from(
        row.querySelectorAll('[data-element-type="table-data-cell"]'),
      ) as HTMLElement[];
      if (cells[cellInfo.colIndex]) {
        columnCells.push(cells[cellInfo.colIndex].getBoundingClientRect());
      }
    });

    const columnLeft = columnCells.length > 0 ? Math.min(...columnCells.map((r) => r.left)) : rowLeft;
    const columnRight = columnCells.length > 0 ? Math.max(...columnCells.map((r) => r.right)) : rowLeft;
    const columnWidth = columnRight - columnLeft;
    const columnTop = columnCells.length > 0 ? Math.min(...columnCells.map((r) => r.top)) : rowTop;

    const isLastRow = cellInfo.rowIndex === cellInfo.totalRows - 1;
    const isLastColumn = cellInfo.colIndex === cellInfo.totalColumns - 1;

    // Check if column is visible within scroll container bounds
    const isColumnVisible = scrollContainerRect
      ? columnLeft >= scrollContainerRect.left - columnWidth &&
        columnRight <= scrollContainerRect.right + columnWidth
      : true;

    // Calculate visible bounds for add buttons
    const visibleLeft = scrollContainerRect?.left ?? tableRect.left;
    const visibleRight = scrollContainerRect?.right ?? tableRect.right;
    const visibleWidth = visibleRight - visibleLeft;

    setPositions({
      rowControls: {
        left: Math.max(0, rowLeft - 32),
        top: rowTop,
        height: rowHeight,
      },
      columnControls: isColumnVisible
        ? {
            left: columnLeft,
            top: columnTop - 32,
            width: columnWidth,
          }
        : null,
      addRowButton: isLastRow
        ? {
            left: visibleLeft,
            top: tableRect.bottom,
            width: visibleWidth,
          }
        : null,
      addColumnButton: isLastColumn
        ? {
            left: Math.min(tableRect.right, visibleRight),
            top: tableRect.top,
            height: tableRect.height,
          }
        : null,
    });
  }, [blockId]);

  // Recalculate positions on scroll/resize
  useEffect(() => {
    if (!hoveredCellInfo || !isVisible) return;

    const handleScrollOrResize = () => {
      recalculatePositions();
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    // Initial calculation
    recalculatePositions();

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [hoveredCellInfo, isVisible, recalculatePositions]);

  // Clear timeout helper
  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  // Schedule hide helper
  const scheduleHide = useCallback(() => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      if (!isOverTableRef.current && !isOverControlsRef.current) {
        setIsVisible(false);
        setHoveredCellInfo(null);
      }
    }, HIDE_DELAY);
  }, [clearHideTimeout]);

  // Find cell info from slate by element ID
  const findCellInfo = useCallback(
    (elementId: string): HoveredCellInfo | null => {
      if (!slate) return null;

      const cellEntries = Array.from(
        Editor.nodes<TableCellElement>(slate, {
          at: [0],
          match: (n) => {
            if (!Element.isElement(n)) return false;
            const element = n as TableCellElement;
            return element.type === 'table-data-cell' && 'id' in element && element.id === elementId;
          },
          mode: 'all',
        }),
      );

      if (cellEntries.length === 0) return null;

      const [, path] = cellEntries[0];
      const rowIndex = path[path.length - 2];
      const colIndex = path[path.length - 1];

      // Get table structure info
      const tableEntries = Array.from(
        Editor.nodes<SlateElement>(slate, {
          at: [0],
          match: (n) => Element.isElement(n) && (n as SlateElement).type === 'table',
          mode: 'lowest',
        }),
      );

      if (tableEntries.length === 0) return null;

      const [tableNode] = tableEntries[0];
      if (!Element.isElement(tableNode)) return null;

      const totalRows = tableNode.children.length;
      const firstRowNode = tableNode.children[0];
      if (!Element.isElement(firstRowNode)) return null;

      const totalColumns = firstRowNode.children.length;

      return {
        rowIndex,
        colIndex,
        cellElementId: elementId,
        totalRows,
        totalColumns,
      };
    },
    [slate],
  );

  // Mouse move handler
  useEffect(() => {
    const tableContainer = document.querySelector(
      `[data-yoopta-block-id="${blockId}"][data-table-container]`,
    );

    if (!tableContainer || !slate) return;

    const handleMouseMove = (e: Event) => {
      clearHideTimeout();
      isOverTableRef.current = true;

      const mouseEvent = e as MouseEvent;
      const target = mouseEvent.target as HTMLElement;
      const cellElement = target.closest('[data-element-type="table-data-cell"]') as HTMLElement;

      if (!cellElement) return;

      const elementId = cellElement.getAttribute('data-yoopta-element-id');
      if (!elementId) return;

      // Only update if cell changed
      const currentInfo = hoveredCellInfoRef.current;
      if (currentInfo?.cellElementId === elementId) {
        setIsVisible(true);
        return;
      }

      const cellInfo = findCellInfo(elementId);
      if (cellInfo) {
        setHoveredCellInfo(cellInfo);
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      isOverTableRef.current = false;
      scheduleHide();
    };

    tableContainer.addEventListener('mousemove', handleMouseMove as EventListener);
    tableContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearHideTimeout();
      tableContainer.removeEventListener('mousemove', handleMouseMove as EventListener);
      tableContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [blockId, slate, findCellInfo, clearHideTimeout, scheduleHide]);

  // Control hover handlers
  const handleControlMouseEnter = useCallback(() => {
    clearHideTimeout();
    isOverControlsRef.current = true;
  }, [clearHideTimeout]);

  const handleControlMouseLeave = useCallback(() => {
    isOverControlsRef.current = false;
    scheduleHide();
  }, [scheduleHide]);

  // Don't render if not visible or no cell info
  if (!isVisible || !hoveredCellInfo) return null;

  return (
    <>
      {positions.rowControls && (
        <RowControls
          blockId={blockId}
          rowIndex={hoveredCellInfo.rowIndex}
          position={positions.rowControls}
          onMouseEnter={handleControlMouseEnter}
          onMouseLeave={handleControlMouseLeave}
        />
      )}

      {positions.columnControls && (
        <ColumnControls
          blockId={blockId}
          colIndex={hoveredCellInfo.colIndex}
          position={positions.columnControls}
          onMouseEnter={handleControlMouseEnter}
          onMouseLeave={handleControlMouseLeave}
        />
      )}

      {positions.addColumnButton && (
        <AddColumnButton
          blockId={blockId}
          totalColumns={hoveredCellInfo.totalColumns}
          position={positions.addColumnButton}
          onMouseEnter={handleControlMouseEnter}
          onMouseLeave={handleControlMouseLeave}
        />
      )}

      {positions.addRowButton && (
        <AddRowButton
          blockId={blockId}
          totalRows={hoveredCellInfo.totalRows}
          position={positions.addRowButton}
          onMouseEnter={handleControlMouseEnter}
          onMouseLeave={handleControlMouseLeave}
        />
      )}
    </>
  );
};
