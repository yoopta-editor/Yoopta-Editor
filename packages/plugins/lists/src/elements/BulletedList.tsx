import type { PluginElementRenderProps } from '@yoopta/editor';
import { useBlockData } from '@yoopta/editor';

const BulletedListRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { blockId, HTMLAttributes = {}, attributes, children } = props;
  const { className = '', ...htmlAttrs } = HTMLAttributes;
  const block = useBlockData(blockId);

  const currentAlign = block?.meta?.align || 'left';
  const alignClass = `yoopta-align-${currentAlign}`;

  return (
    <div
      className={`yoopta-bulleted-list ${alignClass} ${className}`}
      {...htmlAttrs}
      {...attributes}>
      <span className="yoopta-bulleted-list-bullet" contentEditable={false}>
        •
      </span>
      <span className="yoopta-bulleted-list-content">{children}</span>
    </div>
  );
};

export { BulletedListRender };
