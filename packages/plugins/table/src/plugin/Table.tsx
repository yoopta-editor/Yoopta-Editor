import { YooptaPlugin } from '@yoopta/editor';
import * as z from 'zod';

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

const tableDataCellPropsSchema = z.object({
  asHeader: z.boolean(),
  width: z.number(),
});

const tablePropsSchema = z.object({
  headerRow: z.boolean(),
  headerColumn: z.boolean(),
});

const Table = new YooptaPlugin<TableElementMap>({
  type: 'Table',
  elements: (
    <table render={TableRender} propsSchema={tablePropsSchema}>
      <table-row render={TableRow}>
        <table-data-cell render={TableDataCell} propsSchema={tableDataCellPropsSchema} />
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
      serialize: serializeTable,
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
