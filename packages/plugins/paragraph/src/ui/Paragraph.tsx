import type { PluginElementRenderProps } from '@yoopta/editor';

const ParagraphRender = (props: PluginElementRenderProps) => {
  const { className = '', ...htmlAttrs } = props.HTMLAttributes || {};

  return (
    <p className={`yoopta-paragraph ${className}`} {...htmlAttrs} {...props.attributes}>
      {props.children}
    </p>
  );
};

export { ParagraphRender };
