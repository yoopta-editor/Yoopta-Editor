import Box from '@mui/material/Box';
import type { PluginElementRenderProps } from '@yoopta/editor';

export const NumberedList = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <Box
      {...attributes}
      component="ol"
      sx={{
        listStyleType: 'decimal',
        pl: 4,
        my: 2,
        '& > li': {
          mt: 1,
        },
      }}>
      {children}
    </Box>
  );
};
