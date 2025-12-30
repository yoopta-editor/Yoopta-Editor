import Box from '@mui/material/Box';
import type { PluginElementRenderProps } from '@yoopta/editor';

export const BulletedList = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <Box
      {...attributes}
      component="ul"
      sx={{
        listStyleType: 'disc',
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
