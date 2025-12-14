import Typography from '@mui/material/Typography';
import type { PluginElementRenderProps } from '@yoopta/editor';

export const HeadingThree = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  return (
    <Typography variant="h3" id={element.id} draggable={false} {...attributes} component="h3">
      {children}
    </Typography>
  );
};
