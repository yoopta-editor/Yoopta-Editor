import type { PluginElementRenderProps } from '@yoopta/editor';

const Link = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  return (
    <a
      {...attributes}
      href={element.props.url}
      target={element.props.target}
      rel={element.props.rel}
      title={element.props.title}
      className="text-primary font-medium underline underline-offset-4 cursor-pointer">
      {children}
    </a>
  );
};

export { Link };
