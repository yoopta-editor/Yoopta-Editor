import type {
  SlateElement,
  YooEditor,
  YooptaPathIndex} from '@yoopta/editor';
import {
  Blocks,
  Elements,
  generateId
} from '@yoopta/editor';
import type { Span} from 'slate';
import { Editor, Element, Path, Transforms } from 'slate';

import type { InsertTableOptions, TableCellElement, TableElement, TableRowElement } from '../types';

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
  toggleHeaderRow: (editor: YooEditor, blockId: string) => void;
  toggleHeaderColumn: (editor: YooEditor, blockId: string) => void;
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

    const table: TableElement = {
      id: generateId(),
      type: 'table',
      children: [],
      props: {
        headerColumn,
        headerRow,
      },
    };

    for (let i = 0; i < rows; i++) {
      const row: TableRowElement = {
        id: generateId(),
        type: 'table-row',
        children: [],
      };

      for (let j = 0; j < columns; j++) {
        const cell: TableCellElement = {
          id: generateId(),
          type: 'table-data-cell',
          children: [{ text: '' }],
          props: {
            width: columnWidth || 200,
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
      const { insertMode = 'after', path = slate.selection, select = true } = options || {};

      const currentRowElementEntryByPath = Elements.getElementEntry(editor, blockId, {
        // @ts-ignore [FIXME] - Fix this
        path,
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
  deleteTableRow: (editor: YooEditor, blockId: string, options?: DeleteOptions) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const { path = slate.selection } = options || {};

      const currentRowElementEntryByPath = Elements.getElementEntry(editor, blockId, {
        // @ts-ignore [FIXME] - Fix this
        path,
        type: 'table-row',
      });

      if (!currentRowElementEntryByPath) return;

      const [_, currentRowPath] = currentRowElementEntryByPath;

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

      Array.from(tableRowEntries).forEach(([tableRowElement, tableRowPath]) => {
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
      const { insertMode = 'after', path = slate.selection, select = true } = options || {};

      const dataCellElementEntryByPath = Elements.getElementEntry(editor, blockId, {
        // @ts-ignore [FIXME] - Fix this
        path,
        type: 'table-data-cell',
      });

      if (!dataCellElementEntryByPath) return;

      const [_, dataCellPath] = dataCellElementEntryByPath;
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

      if (select) {
        Transforms.select(slate, [0, 0, columnInsertIndex, 0]);
      }
    });
  },
  deleteTableColumn: (editor: YooEditor, blockId: string, options?: DeleteOptions) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const { path = slate.selection } = options || {};

      const tableRowEntries = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table-row',
        mode: 'all',
      });

      const rows = Array.from(tableRowEntries);
      if (rows[0][0].children.length <= 1) return;

      const dataCellElementEntryByPath = Elements.getElementEntry(editor, blockId, {
        // @ts-ignore [FIXME] - Fix this
        path,
        type: 'table-data-cell',
      });

      if (!dataCellElementEntryByPath) return;

      const [_, dataCellPath] = dataCellElementEntryByPath;
      const columnIndex = dataCellPath[dataCellPath.length - 1];

      const dataCellPaths = rows.map(([row, path]) => row.children[columnIndex] ? [...path, columnIndex] : null);

      // [TODO] - Check if there are other columns
      dataCellPaths.forEach((path) => {
        if (path) {
          Transforms.removeNodes(slate, { at: path });
        }
      });
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
            { props: { ...cell.props, width } },
            {
              at: path,
              match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
            },
          );
        }
      });
    });
  },
  toggleHeaderRow: (editor: YooEditor, blockId: string) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const table = Elements.getElement(editor, blockId, { type: 'table', path: [0] });
      const headerRow = table?.props?.headerRow || false;

      const firstTableRowChildren = Editor.nodes<SlateElement>(slate, {
        at: [0, 0],
        match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
        mode: 'all',
      });

      Array.from(firstTableRowChildren).forEach(([cell, path]) => {
        Transforms.setNodes(
          slate,
          { props: { ...cell.props, asHeader: !cell.props?.asHeader } },
          {
            at: path,
            match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
          },
        );
      });

      Transforms.setNodes(
        slate,
        { props: { ...table?.props, headerRow: !headerRow } },
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
      const table = Elements.getElement(editor, blockId, { type: 'table', path: [0] });
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
          { props: { ...cell.props, asHeader: !cell.props?.asHeader } },
          {
            at: path.concat(0),
            match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
          },
        );
      });

      Transforms.setNodes(
        slate,
        { props: { ...table?.props, headerColumn: !headerColumn } },
        {
          at: [0],
          match: (n) => Element.isElement(n) && n.type === 'table',
        },
      );
    });
  },
};
