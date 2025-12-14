import Box from '@mui/material/Box';
import type { PluginElementRenderProps } from '@yoopta/editor';

export const AccordionList = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <Box
      {...attributes}
      sx={{
        width: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}>
      {children}
    </Box>
  );
};
