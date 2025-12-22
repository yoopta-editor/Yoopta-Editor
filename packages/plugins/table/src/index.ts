import { Table } from './plugin/table';
import type { TableCellElement, TableElement, TableRowElement } from './types';

export { TABLE_CELLS_IN_SELECTION, TABLE_SLATE_TO_SELECTION_SET } from './utils/weakMaps';
export { TableCommands } from './commands/table-commands';
export type { TableCellElement, TableElement, TableRowElement };

export default Table;
