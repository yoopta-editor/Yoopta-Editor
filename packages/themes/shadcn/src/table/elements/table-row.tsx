import type { PluginElementRenderProps } from '@yoopta/editor';

import { TableRow as TableRowUI } from '../../ui/table';

export const TableRow = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return <TableRowUI {...attributes}>{children}</TableRowUI>;
};
