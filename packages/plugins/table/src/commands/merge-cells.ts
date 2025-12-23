import type { YooEditor } from '@yoopta/editor';
import { Blocks } from '@yoopta/editor';
import type { Path } from 'slate';
import { Editor, Transforms } from 'slate';

import type { TableCellElement } from '../types';

export type MergeCellsOptions = {
  cells: [TableCellElement, Path][];
};

/**
 * Get cell position (row and column indices)
 */
function getCellPosition(path: Path): { rowIndex: number; colIndex: number } {
  return {
    rowIndex: path[path.length - 2],
    colIndex: path[path.length - 1],
  };
}

/**
 * Merge selected cells into one
 */
export const mergeCells = (editor: YooEditor, blockId: string, options: MergeCellsOptions) => {
  const { cells } = options;

  if (!cells || cells.length <= 1) {
    console.warn('Need at least 2 cells to merge');
    return;
  }

  const slate = Blocks.getBlockSlate(editor, { id: blockId });
  if (!slate) return;

  // Find bounding box of selected cells
  let minRow = Infinity;
  let maxRow = -Infinity;
  let minCol = Infinity;
  let maxCol = -Infinity;

  const cellsMap = new Map<string, [TableCellElement, Path]>();

  cells.forEach(([cell, path]) => {
    const { rowIndex, colIndex } = getCellPosition(path);
    minRow = Math.min(minRow, rowIndex);
    maxRow = Math.max(maxRow, rowIndex);
    minCol = Math.min(minCol, colIndex);
    maxCol = Math.max(maxCol, colIndex);

    cellsMap.set(`${rowIndex}-${colIndex}`, [cell, path]);
  });

  // Calculate span
  const rowSpan = maxRow - minRow + 1;
  const colSpan = maxCol - minCol + 1;

  // Get the top-left cell (anchor cell)
  const anchorKey = `${minRow}-${minCol}`;
  const anchorCell = cellsMap.get(anchorKey);

  if (!anchorCell) {
    console.warn('Anchor cell not found');
    return;
  }

  const [anchorCellElement, anchorPath] = anchorCell;

  // Collect all content from all cells to merge into anchor
  const allContent: any[] = [];

  cells.forEach(([cell, path]) => {
    const { rowIndex, colIndex } = getCellPosition(path);

    // Skip anchor cell for now
    if (rowIndex === minRow && colIndex === minCol) {
      return;
    }

    // Collect content from this cell
    if (cell.children && cell.children.length > 0) {
      cell.children.forEach((child: any) => {
        if (child.text && child.text.trim()) {
          allContent.push(child);
        }
      });
    }
  });

  console.log('allContent', allContent);

  // Batch operations
  Editor.withoutNormalizing(slate, () => {
    const newContent = [
      ...anchorCellElement.children,
      ...(allContent.length > 0 ? allContent : []),
    ];

    console.log('newContent', newContent);

    Transforms.setNodes(
      slate,
      {
        props: {
          ...anchorCellElement.props,
          rowSpan,
          colSpan,
        },
      } as any,
      { at: anchorPath },
    );

    // Add merged content if any
    if (allContent.length > 0) {
      // Remove existing children
      for (let i = anchorCellElement.children.length - 1; i >= 0; i--) {
        Transforms.removeNodes(slate, {
          at: [...anchorPath, i],
        });
      }

      // Insert new content
      newContent.forEach((child, index) => {
        Transforms.insertNodes(slate, child, {
          at: [...anchorPath, index],
        });
      });
    }

    // Remove or hide other cells in the merged area
    // We need to remove them from right to left, bottom to top to maintain paths
    const cellsToRemove: Path[] = [];

    for (let row = maxRow; row >= minRow; row--) {
      for (let col = maxCol; col >= minCol; col--) {
        // Skip anchor cell
        if (row === minRow && col === minCol) continue;

        const cellKey = `${row}-${col}`;
        const cell = cellsMap.get(cellKey);

        if (cell) {
          cellsToRemove.push(cell[1]);
        }
      }
    }

    // Remove cells (from end to start to maintain paths)
    cellsToRemove.forEach((path) => {
      try {
        Transforms.removeNodes(slate, { at: path });
      } catch (error) {
        console.warn('Failed to remove cell at path:', path);
      }
    });
  });

  // Update Yoopta editor state
  // editor.emit('change', slate);
};
