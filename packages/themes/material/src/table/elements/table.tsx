import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import type { PluginElementRenderProps } from '@yoopta/editor';

export const Table = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <MuiTable
      {...attributes}
      sx={{
        width: '100%',
        borderCollapse: 'collapse',
        '& .MuiTableCell-root': {
          border: '1px solid',
          borderColor: 'divider',
        },
      }}>
      <TableBody>{children}</TableBody>
    </MuiTable>
  );
};
