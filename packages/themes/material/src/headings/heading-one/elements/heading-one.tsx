import Typography from '@mui/material/Typography';
import type { PluginElementRenderProps } from '@yoopta/editor';

export const HeadingOne = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  return (
    <Typography variant="h1" id={element.id} draggable={false} {...attributes} component="h1">
      {children}
    </Typography>
  );
};
