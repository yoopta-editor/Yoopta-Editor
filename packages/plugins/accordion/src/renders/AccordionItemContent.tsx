import type { PluginElementRenderProps} from '@yoopta/editor';
import { Elements, useYooptaEditor } from '@yoopta/editor';

export const AccordionItemContent = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { attributes, children, blockId, element } = props;
  const editor = useYooptaEditor();

  const parentPath = Elements.getParentElementPath(editor, blockId, element);
  const parentListItem = Elements.getElement(editor, blockId, {
    path: parentPath,
    type: 'accordion-list-item',
  });

  const isExpanded = parentListItem?.props?.isExpanded;

  if (extendRender) return extendRender(props);

  return (
    <div
      data-state={isExpanded ? 'open' : 'closed'}
      className="yoopta-accordion-list-item-content data-[state=closed]:yoo-accordion-hidden data-[state=closed]:yoo-accordion-animate-accordion-up data-[state=open]:yoo-accordion-animate-accordion-down"
      {...attributes}>
      <div className="yoo-accordion-pb-4 yoo-accordion-pt-0">{children}</div>
    </div>
  );
};
