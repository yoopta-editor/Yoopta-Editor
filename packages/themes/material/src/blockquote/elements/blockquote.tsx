import Typography from '@mui/material/Typography';
import type { PluginElementRenderProps } from '@yoopta/editor';

export const Blockquote = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <Typography
      {...attributes}
      component="blockquote"
      variant="body1"
      sx={{
        borderLeft: '4px solid',
        borderColor: 'divider',
        pl: 3,
        py: 1,
        my: 2,
        fontStyle: 'italic',
        color: 'text.secondary',
      }}>
      {children}
    </Typography>
  );
};
