import { Table } from './plugin/Table';
import type { TableCellElement, TableElement, TableRowElement } from './types';

declare module 'slate' {
  type CustomTypes = {
    Element: TableElement | TableRowElement | TableCellElement;
  };
}

export { TableCommands } from './commands';

export default Table;
