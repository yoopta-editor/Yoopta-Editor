import MuiTableRow from '@mui/material/TableRow';
import type { PluginElementRenderProps } from '@yoopta/editor';

export const TableRow = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <MuiTableRow
      {...attributes}
      sx={{
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}>
      {children}
    </MuiTableRow>
  );
};
