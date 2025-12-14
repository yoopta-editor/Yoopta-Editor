import Box from '@mui/material/Box';
import type { PluginElementRenderProps } from '@yoopta/editor';

export const NumberedListItem = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <Box
      {...attributes}
      component="li"
      sx={{
        display: 'list-item',
        pl: 1,
      }}>
      {children}
    </Box>
  );
};
