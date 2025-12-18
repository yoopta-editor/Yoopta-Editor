import { Table } from './plugin/table';
import type { TableCellElement, TableElement, TableRowElement } from './types';

declare module 'slate' {
  type CustomTypes = {
    Element: TableElement | TableRowElement | TableCellElement;
  };
}

export { TableCommands } from './commands';
export type { TableCellElement, TableElement, TableRowElement };

export default Table;
