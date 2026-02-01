import Typography from '@mui/material/Typography';
import type { PluginElementRenderProps } from '@yoopta/editor';

export const HeadingTwo = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  return (
    <Typography variant="h2" id={element.id} draggable={false} {...attributes} component="h2">
      {children}
    </Typography>
  );
};
