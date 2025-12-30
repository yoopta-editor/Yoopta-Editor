import { Table } from './elements/table';
import { TableDataCell } from './elements/table-data-cell';
import { TableRow } from './elements/table-row';
import './styles.css';

export const TableUI = {
  table: {
    render: Table,
  },
  'table-row': {
    render: TableRow,
  },
  'table-data-cell': {
    render: TableDataCell,
  },
};
