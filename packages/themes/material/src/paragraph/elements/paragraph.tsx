import Typography from '@mui/material/Typography';
import type { PluginElementRenderProps } from '@yoopta/editor';

export const Paragraph = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <Typography
      {...attributes}
      component="p"
      variant="body1"
      sx={{
        mb: 2,
        '&:first-of-type': {
          mt: 0,
        },
      }}>
      {children}
    </Typography>
  );
};
