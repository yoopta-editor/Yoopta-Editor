import type { SlateEditor, SlateElement } from '@yoopta/editor';
import { Editor, Element, Node, Operation, Path, Range } from 'slate';

import type { TableCellElement } from '../types';
import type { SlateNodeEntry } from '../utils/weakMaps';
import { TABLE_CELLS_IN_SELECTION, TABLE_SLATE_TO_SELECTION_SET } from '../utils/weakMaps';

/**
 * Get row and column index from cell path
 * Path structure: [...parentPaths, rowIndex, cellIndex]
 */
function getCellPosition(path: Path): { rowIndex: number; colIndex: number } {
  const rowIndex = path[path.length - 2];
  const colIndex = path[path.length - 1];
  return { rowIndex, colIndex };
}

/**
 * Get table node from cell path
 */
function getTableNode(slate: SlateEditor, cellPath: Path): [SlateElement, Path] | null {
  try {
    // Go up from cell to row to table
    const tablePath = cellPath.slice(0, -2);
    const tableNode = Node.get(slate, tablePath);

    if (Element.isElement(tableNode) && tableNode.type === 'table') {
      return [tableNode, tablePath];
    }
  } catch (error) {
    // Path doesn't exist
  }
  return null;
}

/**
 * Get all cells in rectangular selection
 */
function getCellsInRectangle(
  slate: SlateEditor,
  tablePath: Path,
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
): SlateNodeEntry[] {
  const cells: SlateNodeEntry[] = [];

  // Normalize range (ensure start is before end)
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);

  // Iterate through rows in range
  for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex += 1) {
    const rowPath = [...tablePath, rowIndex];

    try {
      const rowNode = Node.get(slate, rowPath);

      if (!Element.isElement(rowNode) || rowNode.type !== 'table-row') {
        continue;
      }

      // Iterate through cells in row
      for (let colIndex = minCol; colIndex <= maxCol; colIndex += 1) {
        const cellPath = [...rowPath, colIndex];

        try {
          const cellNode = Node.get(slate, cellPath);

          if (Element.isElement(cellNode) && cellNode.type === 'table-data-cell') {
            cells.push([cellNode as TableCellElement, cellPath]);
          }
        } catch (error) {
          // Cell doesn't exist at this position (might be merged)
          continue;
        }
      }
    } catch (error) {
      // Row doesn't exist
      continue;
    }
  }

  return cells;
}

export function withSelection(slate: SlateEditor): SlateEditor {
  const { apply } = slate;

  slate.apply = (op) => {
    if (!Operation.isSelectionOperation(op) || !op.newProperties) {
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
      TABLE_CELLS_IN_SELECTION.delete(slate);
      return apply(op);
    }

    const selection = {
      ...slate.selection,
      ...op.newProperties,
    };

    if (!Range.isRange(selection)) {
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
      TABLE_CELLS_IN_SELECTION.delete(slate);
      return apply(op);
    }

    const [fromEntry] = Editor.nodes(slate, {
      match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
      at: Range.start(selection),
    });

    const [toEntry] = Editor.nodes(slate, {
      match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
      at: Range.end(selection),
    });

    if (!fromEntry || !toEntry) {
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
      TABLE_CELLS_IN_SELECTION.delete(slate);
      return apply(op);
    }

    const [, fromPath] = fromEntry;
    const [, toPath] = toEntry;

    if (Path.equals(fromPath, toPath)) {
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
      TABLE_CELLS_IN_SELECTION.delete(slate);
      return apply(op);
    }

    const fromPos = getCellPosition(fromPath);
    const toPos = getCellPosition(toPath);

    const fromTableEntry = getTableNode(slate, fromPath);
    const toTableEntry = getTableNode(slate, toPath);

    if (!fromTableEntry || !toTableEntry) {
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
      TABLE_CELLS_IN_SELECTION.delete(slate);
      return apply(op);
    }

    const [, fromTablePath] = fromTableEntry;
    const [, toTablePath] = toTableEntry;

    if (!Path.equals(fromTablePath, toTablePath)) {
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
      TABLE_CELLS_IN_SELECTION.delete(slate);
      return apply(op);
    }

    const cellsInRectangle = getCellsInRectangle(
      slate,
      fromTablePath,
      fromPos.rowIndex,
      fromPos.colIndex,
      toPos.rowIndex,
      toPos.colIndex,
    );

    if (cellsInRectangle.length === 0) {
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
      TABLE_CELLS_IN_SELECTION.delete(slate);
      return apply(op);
    }

    const selectedSet = new WeakSet<SlateElement>();
    cellsInRectangle.forEach(([cell]) => {
      selectedSet.add(cell);
    });

    TABLE_CELLS_IN_SELECTION.set(slate, cellsInRectangle);
    TABLE_SLATE_TO_SELECTION_SET.set(slate, selectedSet);

    apply(op);
  };

  return slate;
}
