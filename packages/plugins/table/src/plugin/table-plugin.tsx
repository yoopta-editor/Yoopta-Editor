import { YooptaPlugin } from '@yoopta/editor';

import { TableCommands } from '../commands/table-commands';
import { onKeyDown } from '../events/onKeyDown';
import { withTable } from '../extenstions/withTable';
import { serializeTableToEmail } from '../parsers/email/serialize';
import { deserializeTable } from '../parsers/html/deserialize';
import { serializeMarkown } from '../parsers/markdown/serialize';
import type { TableDataCellElementProps, TableElementMap, TableElementProps } from '../types';
import { TABLE_CELLS_IN_SELECTION, TABLE_SLATE_TO_SELECTION_SET } from '../utils/weakMaps';

const tableDataCellProps: TableDataCellElementProps = {
  asHeader: false,
  verticalAlign: 'top',
  align: 'left',
  colSpan: 1,
  rowSpan: 1,
  backgroundColor: undefined,
  color: undefined,
};

const tableProps: TableElementProps = {
  headerRow: false,
  headerColumn: false,
  columnWidths: [200, 150, 250],
};

const Table = new YooptaPlugin<TableElementMap>({
  type: 'Table',
  elements: (
    <table
      render={(props) => (
        <table {...props.attributes} {...tableProps}>
          <tbody {...props.attributes}>{props.children}</tbody>
        </table>
      )}
      nodeType="block">
      <table-row
        render={(props) => <tr {...props.attributes}>{props.children}</tr>}
        nodeType="block">
        <table-data-cell
          render={(props) => <td {...props.attributes}>{props.children}</td>}
          props={tableDataCellProps}
          nodeType="block"
        />
      </table-row>
    </table>
  ),
  events: {
    onKeyDown,
    onBlur: (_, slate) => () => {
      // Clear selection on blur
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
      TABLE_CELLS_IN_SELECTION.delete(slate);
    },
  },
  lifecycle: {
    beforeCreate: (editor) => TableCommands.buildTableElements(editor, { rows: 3, columns: 3 }),
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
