import { YooptaPlugin } from '@yoopta/editor';

import { TableCommands } from '../commands';
import { Table as TableRender } from '../elements/Table';
import { TableDataCell } from '../elements/TableDataCell';
import { TableRow } from '../elements/TableRow';
import { onKeyDown } from '../events/onKeyDown';
import { withTable } from '../extenstions/withTable';
import { serializeTableToEmail } from '../parsers/email/serialize';
import { deserializeTable } from '../parsers/html/deserialize';
import { serializeTable } from '../parsers/html/serialize';
import { serializeMarkown } from '../parsers/markdown/serialize';
import type { TableElementMap } from '../types';
import { TABLE_SLATE_TO_SELECTION_SET } from '../utils/weakMaps';

const tableDataCellProps = {
  asHeader: false,
  width: 200,
};

const tableProps = {
  headerRow: false,
  headerColumn: false,
};

const Table = new YooptaPlugin<TableElementMap>({
  type: 'Table',
  elements: (
    <table render={TableRender} props={tableProps}>
      <table-row render={TableRow}>
        <table-data-cell render={TableDataCell} props={tableDataCellProps} />
      </table-row>
    </table>
  ),
  events: {
    onKeyDown,
    onBlur: (editor, slate) => () => {
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
    },
    onBeforeCreate(editor) {
      return TableCommands.buildTableElements(editor, { rows: 3, columns: 3 });
    },
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['TABLE'],
        parse: deserializeTable,
      },
    },
    markdown: {
      serialize: serializeMarkown,
    },
    email: {
      serialize: serializeTableToEmail,
    },
  },
  extensions: withTable,
  options: {
    display: {
      title: 'Table',
      description: 'Add simple table',
    },
    shortcuts: ['table', '||', '3x3'],
  },
  commands: TableCommands,
});

export { Table };
