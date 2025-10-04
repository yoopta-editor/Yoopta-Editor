import type { PluginElementRenderProps} from '@yoopta/editor';
import { useYooptaEditor } from '@yoopta/editor';

const TableRow = ({
  attributes,
  children,
  element,
  blockId,
  HTMLAttributes,
  extendRender,
}: PluginElementRenderProps) => {
  if (extendRender) {
    // @ts-ignore [FIXME] - add generic type for extendRender props
    return extendRender({ attributes, children, blockId, element, HTMLAttributes });
  }

  const { className = '', ...htmlAttrs } = HTMLAttributes || {};

  return (
    <tr
      {...htmlAttrs}
      className={`yoopta-table-row ${className}`}
      data-element-id={element.id}
      {...attributes}>
      {children}
    </tr>
  );
};

export { TableRow };
