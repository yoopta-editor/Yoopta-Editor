import type { SlateElement, YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, Elements, generateId } from '@yoopta/editor';
import type { Span } from 'slate';
import { Editor, Element, Path, Transforms } from 'slate';

import type { InsertTableOptions, TableCellElement, TableElement, TableRowElement } from '../types';
import type { ClearContentsOptions } from './clear-contents';
import { clearContents } from './clear-contents';
import type { MergeCellsOptions } from './merge-cells';
import { mergeCells } from './merge-cells';

type Options = {
  path?: Location | Span;
  select?: boolean;
  insertMode?: 'before' | 'after';
};

type DeleteOptions = Omit<Options, 'insertMode' | 'select'>;

type MoveTableOptions = {
  from: Path;
  to: Path;
};

type InsertOptions = Partial<
  InsertTableOptions & {
    at: YooptaPathIndex;
  }
>;

type UpdateCellsOptions = {
  cells: [TableCellElement, Path][];
};

export type TableCommands = {
  buildTableElements: (editor: YooEditor, options?: InsertOptions) => TableElement;
  insertTable: (editor: YooEditor, options?: InsertOptions) => void;
  deleteTable: (editor: YooEditor, blockId: string) => void;
  insertTableRow: (editor: YooEditor, blockId: string, options?: Options) => void;
  deleteTableRow: (editor: YooEditor, blockId: string, options?: DeleteOptions) => void;
  moveTableRow: (editor: YooEditor, blockId: string, options: MoveTableOptions) => void;
  moveTableColumn: (editor: YooEditor, blockId: string, options: MoveTableOptions) => void;
  insertTableColumn: (editor: YooEditor, blockId: string, options?: Options) => void;
  deleteTableColumn: (editor: YooEditor, blockId: string, options?: DeleteOptions) => void;
  updateColumnWidth: (
    editor: YooEditor,
    blockId: string,
    columnIndex: number,
    width: number,
  ) => void;
  setColumnWidth: (
    editor: YooEditor,
    blockId: string,
    columnIndex: number,
    width: number,
  ) => void;
  toggleHeaderRow: (editor: YooEditor, blockId: string) => void;
  toggleHeaderColumn: (editor: YooEditor, blockId: string) => void;
  clearContents: (editor: YooEditor, blockId: string, options: ClearContentsOptions) => void;
  mergeCells: (editor: YooEditor, blockId: string, options: MergeCellsOptions) => void;
  setCellBackgroundColor: (editor: YooEditor, blockId: string, options: UpdateCellsOptions & { color: string }) => void;
  setCellTextColor: (editor: YooEditor, blockId: string, options: UpdateCellsOptions & { color: string }) => void;
  setCellHorizontalAlign: (editor: YooEditor, blockId: string, options: UpdateCellsOptions & { align: 'left' | 'center' | 'right' | 'justify' }) => void;
  setCellVerticalAlign: (editor: YooEditor, blockId: string, options: UpdateCellsOptions & { align: 'top' | 'middle' | 'bottom' }) => void;
};

export const TableCommands: TableCommands = {
  buildTableElements: (editor: YooEditor, options?: InsertOptions) => {
    const {
      rows = 3,
      columns = 3,
      columnWidth = 200,
      headerColumn = false,
      headerRow = false,
    } = options || {};

    // Initialize columnWidths array
    const columnWidths = Array(columns).fill(columnWidth);

    const table: TableElement = {
      id: generateId(),
      type: 'table',
      children: [],
      props: {
        headerColumn,
        headerRow,
        columnWidths,
      },
    };

    for (let i = 0; i < rows; i += 1) {
      const row: TableRowElement = {
        id: generateId(),
        type: 'table-row',
        children: [],
      };

      for (let j = 0; j < columns; j += 1) {
        const cell: TableCellElement = {
          id: generateId(),
          type: 'table-data-cell',
          children: [{ text: '' }],
          props: {
            // columnWidth: columnWidth ?? 200,
            asHeader: i === 0 ? !!headerRow : false,
          },
        };

        row.children.push(cell);
      }

      table.children.push(row);
    }

    return table;
  },
  insertTable: (editor: YooEditor, options?: InsertOptions) => {
    const table = TableCommands.buildTableElements(editor, options);
    const block = Blocks.buildBlockData({ value: [table], type: 'Table' });
    Blocks.insertBlock(editor, block.type, { ...options, blockData: block });
  },
  deleteTable: (editor: YooEditor, blockId: string) => {
    editor.deleteBlock({ blockId });
  },
  insertTableRow: (editor: YooEditor, blockId: string, options?: Options) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const { insertMode = 'after', select = true } = options || {};

      const currentRowElementEntryByPath = Elements.getElementEntry(editor, {
        blockId,
        path: slate.selection?.anchor.path,
        type: 'table-row',
      });

      if (!currentRowElementEntryByPath) return;

      const [currentRowElement, currentRowPath] = currentRowElementEntryByPath;
      const insertPath = insertMode === 'before' ? currentRowPath : Path.next(currentRowPath);

      const newRow: SlateElement = {
        id: generateId(),
        type: 'table-row',
        children: currentRowElement.children.map((cell) => ({
          id: generateId(),
          type: 'table-data-cell',
          children: [{ text: '' }],
        })),
        props: {
          nodeType: 'block',
        },
      };

      Transforms.insertNodes(slate, newRow, { at: insertPath });
      if (select) {
        Transforms.select(slate, [...insertPath, 0]);
      }
    });
  },
  deleteTableRow: (editor: YooEditor, blockId: string, _options?: DeleteOptions) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const currentRowElementEntryByPath = Elements.getElementEntry(editor, {
        blockId,
        path: slate.selection?.anchor.path,
        type: 'table-row',
      });

      if (!currentRowElementEntryByPath) return;

      const [, currentRowPath] = currentRowElementEntryByPath;

      const tableRowEntries = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table-row',
        mode: 'highest',
      });

      const tableRows = Array.from(tableRowEntries);
      if (tableRows.length === 1) return;

      Transforms.removeNodes(slate, {
        at: currentRowPath,
        match: (n) => Element.isElement(n) && n.type === 'table-row',
      });
    });
  },
  moveTableRow: (editor: YooEditor, blockId: string, { from, to }: MoveTableOptions) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      Transforms.moveNodes(slate, {
        at: from,
        to,
        match: (n) => Element.isElement(n) && n.type === 'table-row',
      });
    });
  },
  moveTableColumn: (editor: YooEditor, blockId: string, { from, to }: MoveTableOptions) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const tableRowEntries = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table-row',
        mode: 'all',
      });

      Array.from(tableRowEntries).forEach(([_tableRowElement, tableRowPath]) => {
        Transforms.moveNodes(slate, {
          at: tableRowPath.concat(from[from.length - 1]),
          to: [...tableRowPath, to[to.length - 1]],
          match: (n) => Element.isElement(n),
        });
      });
    });
  },
  insertTableColumn: (editor: YooEditor, blockId: string, options?: Options) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const { insertMode = 'after', select = true } = options || {};

      const dataCellElementEntryByPath = Elements.getElementEntry(editor, {
        blockId,
        path: slate.selection?.anchor.path,
        type: 'table-data-cell',
      });

      if (!dataCellElementEntryByPath) return;

      const [, dataCellPath] = dataCellElementEntryByPath;
      const columnIndex = dataCellPath[dataCellPath.length - 1];
      const columnInsertIndex =
        insertMode === 'before' ? columnIndex : Path.next(dataCellPath)[dataCellPath.length - 1];

      const elementEntries = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table-row',
        mode: 'lowest',
      });

      for (const [, tableRowPath] of elementEntries) {
        const newDataCell: TableCellElement = {
          id: generateId(),
          type: 'table-data-cell',
          children: [{ text: '' }],
        };

        Transforms.insertNodes(slate, newDataCell, { at: [...tableRowPath, columnInsertIndex] });
      }

      // Update columnWidths array
      const tableEntry = Editor.nodes<TableElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table',
        mode: 'highest',
      });

      const tableEntryArray = Array.from(tableEntry);
      if (tableEntryArray.length > 0) {
        const [tableElement, tablePath] = tableEntryArray[0];
        const currentWidths = tableElement.props?.columnWidths ?? [];
        const newWidths = [...currentWidths];
        // Insert default width at the new column position
        newWidths.splice(columnInsertIndex, 0, 200);

        Transforms.setNodes(
          slate,
          {
            props: {
              ...tableElement.props,
              columnWidths: newWidths,
            },
          } as Partial<TableElement>,
          {
            at: tablePath,
            match: (n) => Element.isElement(n) && n.type === 'table',
          },
        );
      }

      if (select) {
        Transforms.select(slate, [0, 0, columnInsertIndex, 0]);
      }
    });
  },
  deleteTableColumn: (editor: YooEditor, blockId: string, _options?: DeleteOptions) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const tableRowEntries = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table-row',
        mode: 'all',
      });

      const rows = Array.from(tableRowEntries);
      if (rows[0][0].children.length <= 1) return;

      const dataCellElementEntryByPath = Elements.getElementEntry(editor, {
        blockId,
        path: slate.selection?.anchor.path,
        type: 'table-data-cell',
      });

      if (!dataCellElementEntryByPath) return;

      const [_, dataCellPath] = dataCellElementEntryByPath;
      const columnIndex = dataCellPath[dataCellPath.length - 1];

      const dataCellPaths = rows.map(([row, path]) =>
        row.children[columnIndex] ? [...path, columnIndex] : null,
      );

      // Remove cells from each row
      dataCellPaths.forEach((path) => {
        if (path) {
          Transforms.removeNodes(slate, { at: path });
        }
      });

      // Update columnWidths array
      const tableEntry = Editor.nodes<TableElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table',
        mode: 'highest',
      });

      const tableEntryArray = Array.from(tableEntry);
      if (tableEntryArray.length > 0) {
        const [tableElement, tablePath] = tableEntryArray[0];
        const currentWidths = tableElement.props?.columnWidths ?? [];
        const newWidths = [...currentWidths];
        // Remove width at the deleted column position
        newWidths.splice(columnIndex, 1);

        Transforms.setNodes(
          slate,
          {
            props: {
              ...tableElement.props,
              columnWidths: newWidths,
            },
          } as Partial<TableElement>,
          {
            at: tablePath,
            match: (n) => Element.isElement(n) && n.type === 'table',
          },
        );
      }
    });
  },
  updateColumnWidth: (editor: YooEditor, blockId: string, columnIndex: number, width: number) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const tableDataCellsPerColumn = Editor.nodes<TableCellElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
        mode: 'all',
      });

      Array.from(tableDataCellsPerColumn).forEach(([cell, path]) => {
        if (path[path.length - 1] === columnIndex) {
          Transforms.setNodes(
            slate,
            { ...cell, props: { ...cell.props, width } },
            {
              at: path,
              match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
            },
          );
        }
      });
    });
  },
  setColumnWidth: (editor: YooEditor, blockId: string, columnIndex: number, width: number) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    const minWidth = 50;
    const clampedWidth = Math.max(minWidth, width);

    Editor.withoutNormalizing(slate, () => {
      // Get the table element
      const tableEntry = Editor.nodes<TableElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table',
        mode: 'highest',
      });

      const tableEntryArray = Array.from(tableEntry);
      if (tableEntryArray.length === 0) return;

      const [tableElement, tablePath] = tableEntryArray[0];

      // Get current columnWidths or create default array
      const currentWidths = tableElement.props?.columnWidths ?? [];
      const firstRow = tableElement.children[0] as SlateElement;
      const numColumns = firstRow?.children?.length ?? 0;

      // Ensure we have widths for all columns
      const newWidths: number[] = [];
      for (let i = 0; i < numColumns; i++) {
        if (i === columnIndex) {
          newWidths.push(clampedWidth);
        } else if (currentWidths[i] !== undefined) {
          newWidths.push(typeof currentWidths[i] === 'number' ? currentWidths[i] : parseInt(String(currentWidths[i]), 10) || 200);
        } else {
          newWidths.push(200); // Default width
        }
      }

      // Update the table element with new columnWidths
      Transforms.setNodes(
        slate,
        {
          props: {
            ...tableElement.props,
            columnWidths: newWidths,
          },
        } as Partial<TableElement>,
        {
          at: tablePath,
          match: (n) => Element.isElement(n) && n.type === 'table',
        },
      );
    });
  },
  toggleHeaderRow: (editor: YooEditor, blockId: string) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const table = Elements.getElement(editor, { blockId, type: 'table', path: [0] });
      const headerRow = table?.props?.headerRow || false;

      const firstTableRowChildren = Editor.nodes<SlateElement>(slate, {
        at: [0, 0],
        match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
        mode: 'all',
      });

      Array.from(firstTableRowChildren).forEach(([cell, path]) => {
        Transforms.setNodes(
          slate,
          { ...cell, props: { ...cell.props, asHeader: !cell.props?.asHeader } },
          {
            at: path,
            match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
          },
        );
      });

      Transforms.setNodes(
        slate,
        { ...table, props: { ...table?.props, headerRow: !headerRow } },
        {
          at: [0],
          match: (n) => Element.isElement(n) && n.type === 'table',
        },
      );
    });
  },
  toggleHeaderColumn: (editor: YooEditor, blockId: string) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const table = Elements.getElement(editor, { blockId, type: 'table', path: [0] });
      const headerColumn = table?.props?.headerColumn || false;

      const tableRows = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table-row',
        mode: 'all',
      });

      Array.from(tableRows).forEach(([row, path]) => {
        const cell = row.children[0] as TableCellElement;

        Transforms.setNodes(
          slate,
          { ...cell, props: { ...cell.props, asHeader: !cell.props?.asHeader } },
          {
            at: path.concat(0),
            match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
          },
        );
      });

      Transforms.setNodes(
        slate,
        { ...table, props: { ...table?.props, headerColumn: !headerColumn } },
        {
          at: [0],
          match: (n) => Element.isElement(n) && n.type === 'table',
        },
      );
    });
  },
  clearContents: (editor: YooEditor, blockId: string, options: ClearContentsOptions) => {
    clearContents(editor, blockId, options);
  },
  mergeCells: (editor: YooEditor, blockId: string, options: MergeCellsOptions) => {
    mergeCells(editor, blockId, options);
  },
  setCellBackgroundColor: (editor: YooEditor, blockId: string, options: UpdateCellsOptions & { color: string }) => {
    const { cells, color } = options;

    if (!cells || cells.length === 0) {
      console.warn('No cells to update');
      return;
    }

    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      cells.forEach(([cell, path]) => {
        Transforms.setNodes(
          slate,
          {
            ...cell,
            props: {
              ...cell.props,
              backgroundColor: color === 'transparent' ? undefined : color,
            },
          } as any,
          {
            at: path,
            match: (n) => Element.isElement(n) && (n as any).type === 'table-data-cell',
          },
        );
      });
    });
  },
  setCellTextColor: (editor: YooEditor, blockId: string, options: UpdateCellsOptions & { color: string }) => {
    const { cells, color } = options;

    console.log('setCellTextColor cells', cells);

    if (!cells || cells.length === 0) {
      console.warn('No cells to update');
      return;
    }

    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      cells.forEach(([cell, path]) => {
        Transforms.setNodes(
          slate,
          {
            ...cell,
            props: {
              ...cell.props,
              color: color === 'inherit' ? undefined : color,
            },
          } as any,
          {
            at: path,
            match: (n) => Element.isElement(n) && (n as any).type === 'table-data-cell',
          },
        );
      });
    });
  },
  setCellHorizontalAlign: (editor: YooEditor, blockId: string, options: UpdateCellsOptions & { align: 'left' | 'center' | 'right' | 'justify' }) => {
    const { cells, align } = options;

    if (!cells || cells.length === 0) {
      console.warn('No cells to update');
      return;
    }

    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      cells.forEach(([cell, path]) => {
        Transforms.setNodes(
          slate,
          {
            ...cell,
            props: {
              ...cell.props,
              align,
            },
          } as any,
          {
            at: path,
            match: (n) => Element.isElement(n) && (n as any).type === 'table-data-cell',
          },
        );
      });
    });
  },
  setCellVerticalAlign: (editor: YooEditor, blockId: string, options: UpdateCellsOptions & { align: 'top' | 'middle' | 'bottom' }) => {
    const { cells, align } = options;

    if (!cells || cells.length === 0) {
      console.warn('No cells to update');
      return;
    }

    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      cells.forEach(([cell, path]) => {
        Transforms.setNodes(
          slate,
          {
            ...cell,
            props: {
              ...cell.props,
              verticalAlign: align,
            },
          } as any,
          {
            at: path,
            match: (n) => Element.isElement(n) && (n as any).type === 'table-data-cell',
          },
        );
      });
    });
  },
};
