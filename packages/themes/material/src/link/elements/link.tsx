import MuiLink from '@mui/material/Link';
import type { PluginElementRenderProps } from '@yoopta/editor';

const Link = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  return (
    <MuiLink
      {...attributes}
      href={element.props.url || '#'}
      target={element.props.target}
      rel={element.props.rel}
      title={element.props.title}
      underline="hover"
      color="primary">
      {children}
    </MuiLink>
  );
};

export { Link };
