import type { PluginElementRenderProps } from '@yoopta/editor';

const BlockquoteRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { className = '', ...htmlAttrs } = props.HTMLAttributes || {};

  if (extendRender) {
    return extendRender(props);
  }

  return (
    <blockquote className={`yoopta-blockquote ${className}`} {...htmlAttrs} {...props.attributes}>
      {props.children}
    </blockquote>
  );
};

export { BlockquoteRender };
