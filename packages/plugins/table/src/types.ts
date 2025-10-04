import type { SlateElement } from '@yoopta/editor';

export type TablePluginElementKeys = 'table' | 'table-row' | 'table-data-cell';

export type TableDataCellElementProps = {
  width: number;
  asHeader: boolean;
};

export type TableElementProps = {
  headerRow?: boolean;
  headerColumn?: boolean;
};

export type TableElement = SlateElement<'table', TableElementProps>;
export type TableCellElement = SlateElement<'table-data-cell', TableDataCellElementProps>;
export type TableRowElement = SlateElement;

export type TableElementMap = {
  table: TableElement;
  'table-data-cell': TableCellElement;
  'table-row': TableRowElement;
};

export type InsertTableOptions = {
  rows: number;
  columns: number;
  columnWidth?: number;
  headerColumn?: boolean;
  headerRow?: boolean;
};
