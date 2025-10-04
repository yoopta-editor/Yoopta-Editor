import type { PluginElementRenderProps } from '@yoopta/editor';

const ParagraphRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { className = '', ...htmlAttrs } = props.HTMLAttributes || {};

  if (extendRender) return extendRender(props);

  return (
    <p className={`yoopta-paragraph ${className}`} {...htmlAttrs} {...props.attributes}>
      {props.children}
    </p>
  );
};

export { ParagraphRender };
