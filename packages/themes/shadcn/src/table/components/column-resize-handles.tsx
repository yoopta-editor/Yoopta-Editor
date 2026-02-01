import { useCallback, useEffect, useRef, useState } from 'react';
import { useYooptaEditor } from '@yoopta/editor';
import { TableCommands } from '@yoopta/table';
import { Portal } from '@yoopta/ui/portal';

type ColumnResizeHandlesProps = {
  blockId: string;
};

type ColumnInfo = {
  index: number;
  left: number;
  width: number;
};

const MIN_COLUMN_WIDTH = 50;

export const ColumnResizeHandles = ({ blockId }: ColumnResizeHandlesProps) => {
  const editor = useYooptaEditor();

  const [tableRect, setTableRect] = useState<DOMRect | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumnIndex, setResizingColumnIndex] = useState<number | null>(null);

  // Local widths for smooth resizing (not committed to Slate yet)
  const [localWidths, setLocalWidths] = useState<number[]>([]);

  // Refs for drag operation (to avoid stale closure issues)
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  const currentWidthsRef = useRef<number[]>([]);
  const resizingIndexRef = useRef<number | null>(null);
  const tableRectRef = useRef<DOMRect | null>(null);
  const colGroupRef = useRef<HTMLElement | null>(null);

  // Keep refs in sync
  useEffect(() => {
    currentWidthsRef.current = localWidths;
  }, [localWidths]);

  useEffect(() => {
    tableRectRef.current = tableRect;
  }, [tableRect]);

  useEffect(() => {
    resizingIndexRef.current = resizingColumnIndex;
  }, [resizingColumnIndex]);

  // Get column positions and widths
  const updateColumnInfo = useCallback(() => {
    const tableContainer = document.querySelector(
      `[data-yoopta-block-id="${blockId}"][data-table-container]`,
    ) as HTMLElement;

    if (!tableContainer) return;

    const tableElement = tableContainer.querySelector('table');
    if (!tableElement) return;

    const rect = tableElement.getBoundingClientRect();
    setTableRect(rect);

    // Get colgroup for direct DOM manipulation during resize
    const colGroup = tableElement.querySelector('colgroup');
    colGroupRef.current = colGroup;

    // Get column widths from colgroup or first row cells
    const colElements = tableElement.querySelectorAll('colgroup col');
    const firstRow = tableElement.querySelector('tr');

    if (colElements.length > 0) {
      const columnInfos: ColumnInfo[] = [];
      const widths: number[] = [];
      let accumulatedLeft = rect.left;

      colElements.forEach((col, index) => {
        const style = window.getComputedStyle(col);
        const width = parseInt(style.width, 10) || 200;
        widths.push(width);

        columnInfos.push({
          index,
          left: accumulatedLeft,
          width,
        });

        accumulatedLeft += width;
      });

      // setColumns(columnInfos);
      setLocalWidths(widths);
    } else if (firstRow) {
      // Fallback to measuring cells
      const cells = firstRow.querySelectorAll('td, th');
      const columnInfos: ColumnInfo[] = [];
      const widths: number[] = [];

      cells.forEach((cell, index) => {
        const cellRect = cell.getBoundingClientRect();
        widths.push(cellRect.width);
        columnInfos.push({
          index,
          left: cellRect.left,
          width: cellRect.width,
        });
      });

      // setColumns(columnInfos);
      setLocalWidths(widths);
    }
  }, [blockId]);

  useEffect(() => {
    updateColumnInfo();

    const tableContainer = document.querySelector(
      `[data-yoopta-block-id="${blockId}"][data-table-container]`,
    ) as HTMLElement;

    if (!tableContainer) return;

    const tableElement = tableContainer.querySelector('table');
    if (!tableElement) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!isResizing) {
        updateColumnInfo();
      }
    });
    resizeObserver.observe(tableElement);

    // Also observe mutations for when columns are added/removed
    const mutationObserver = new MutationObserver(() => {
      if (!isResizing) {
        updateColumnInfo();
      }
    });
    mutationObserver.observe(tableElement, { childList: true, subtree: true });

    const handleScroll = () => {
      if (!isResizing) {
        updateColumnInfo();
      }
    };

    window.addEventListener('scroll', handleScroll, true);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [blockId, updateColumnInfo, isResizing]);

  // Apply local widths directly to DOM during resize for smooth feedback
  const applyWidthsToDOM = useCallback((widths: number[]) => {
    if (!colGroupRef.current) return;

    const colElements = colGroupRef.current.querySelectorAll('col');
    colElements.forEach((col, index) => {
      if (widths[index] !== undefined) {
        (col as HTMLElement).style.width = `${widths[index]}px`;
      }
    });
  }, []);

  // Recalculate column positions based on widths
  const getColumnsFromWidths = useCallback((widths: number[], rect: DOMRect | null): ColumnInfo[] => {
    if (!rect || widths.length === 0) return [];

    let accumulatedLeft = rect.left;
    return widths.map((width, index) => {
      const col: ColumnInfo = {
        index,
        left: accumulatedLeft,
        width,
      };
      accumulatedLeft += width;
      return col;
    });
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, columnIndex: number) => {
      e.preventDefault();
      e.stopPropagation();

      const width = localWidths[columnIndex];
      if (width === undefined) return;

      setIsResizing(true);
      setResizingColumnIndex(columnIndex);
      startXRef.current = e.clientX;
      startWidthRef.current = width;

      document.body.classList.add('resizing-column');
    },
    [localWidths],
  );

  // Use refs in mouse move for latest values
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const columnIndex = resizingIndexRef.current;
    if (columnIndex === null) return;

    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.max(MIN_COLUMN_WIDTH, startWidthRef.current + deltaX);

    // Update local widths using ref to get current values
    const newWidths = [...currentWidthsRef.current];
    newWidths[columnIndex] = newWidth;

    // Update state for re-render (handle positions)
    setLocalWidths(newWidths);

    // Apply directly to DOM for smooth visual feedback
    applyWidthsToDOM(newWidths);
  }, [applyWidthsToDOM]);

  const handleMouseUp = useCallback(() => {
    const columnIndex = resizingIndexRef.current;
    const widths = currentWidthsRef.current;

    if (columnIndex !== null && widths[columnIndex] !== undefined) {
      // Commit the final width to Slate
      TableCommands.setColumnWidth(editor, blockId, columnIndex, widths[columnIndex]);
    }

    setIsResizing(false);
    setResizingColumnIndex(null);
    document.body.classList.remove('resizing-column');

    // Update column info after commit
    setTimeout(updateColumnInfo, 50);
  }, [editor, blockId, updateColumnInfo]);

  // Attach global mouse events for dragging
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (!tableRect || localWidths.length === 0) return null;

  // Calculate display columns from local widths
  const displayColumns = getColumnsFromWidths(localWidths, tableRect);

  // Render resize handles between columns (not after the last one)
  const resizeHandles = displayColumns.slice(0, -1).map((column) => {
    const handleLeft = column.left + column.width - 3; // Position at right edge of column

    return (
      <div
        key={`resize-${column.index}`}
        className="column-resize-handle"
        style={{
          position: 'fixed',
          left: `${handleLeft}px`,
          top: `${tableRect.top}px`,
          width: '6px',
          height: `${tableRect.height}px`,
          cursor: 'col-resize',
          zIndex: 50,
          backgroundColor:
            isResizing && resizingColumnIndex === column.index
              ? 'hsl(var(--primary))'
              : 'transparent',
        }}
        onMouseDown={(e) => handleMouseDown(e, column.index)}
        onMouseEnter={(e) => {
          if (!isResizing) {
            (e.target as HTMLElement).style.backgroundColor = 'hsl(var(--primary) / 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isResizing) {
            (e.target as HTMLElement).style.backgroundColor = 'transparent';
          }
        }}
      />
    );
  });

  return (<Portal id='column-resize-handles-container'>
    <div
      className="column-resize-handles-container"
      style={{ pointerEvents: isResizing ? 'auto' : undefined }}
    >
      {resizeHandles}
    </div>
  </Portal>)
};
