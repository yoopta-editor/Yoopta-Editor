import type { TableCellElement, TableElement, TableRowElement } from './types';
import './styles.css';
import { Table } from './plugin/Table';

declare module 'slate' {
  type CustomTypes = {
    Element: TableElement | TableRowElement | TableCellElement;
  };
}

export { TableCommands } from './commands';

export default Table;
