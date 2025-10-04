import type { MouseEvent } from 'react';
import type {
  PluginElementRenderProps} from '@yoopta/editor';
import {
  Blocks,
  Elements,
  useYooptaEditor,
  useYooptaReadOnly,
} from '@yoopta/editor';
import { ChevronUp, Plus, TrashIcon } from 'lucide-react';
import { Path } from 'slate';

export const AccordionItemHeading = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { attributes, children, blockId, element } = props;
  const editor = useYooptaEditor();
  const isReadOnly = useYooptaReadOnly();

  const onToggleExpand = (event: MouseEvent) => {
    event.stopPropagation();

    const parentPath = Elements.getParentElementPath(editor, blockId, element)!;
    const listItemElement = Elements.getElement(editor, blockId, {
      path: parentPath,
      type: 'accordion-list-item',
    });

    if (listItemElement) {
      Elements.updateElement(
        editor,
        blockId,
        { type: 'accordion-list-item', props: { isExpanded: !listItemElement.props?.isExpanded } },
        { path: parentPath },
      );
    }
  };

  const onAddAccordionItem = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const parentPath = Elements.getParentElementPath(editor, blockId, element)!;
    const listItemPath = parentPath;
    const nextListItemPath = Path.next(listItemPath);

    Elements.createElement(
      editor,
      blockId,
      { type: 'accordion-list-item', props: { isExpanded: true } },
      { path: nextListItemPath, focus: true },
    );
  };

  const onDeleteAccordionItem = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const parentPath = Elements.getParentElementPath(editor, blockId, element);

    const accordionListItems = Elements.getElementChildren(editor, blockId, {
      path: parentPath,
      type: 'accordion-list',
    });

    if (accordionListItems?.length === 1) {
      Blocks.deleteBlock(editor, { blockId });
      return;
    }

    if (parentPath) {
      Elements.deleteElement(editor, blockId, { type: 'accordion-list-item', path: parentPath });
    }
  };

  const parentPath = Elements.getParentElementPath(editor, blockId, element);
  const nodeEl = Elements.getElement(editor, blockId, {
    path: parentPath,
    type: 'accordion-list-item',
  });
  const isExpanded = nodeEl?.props?.isExpanded;

  if (extendRender) return extendRender(props);

  return (
    <div
      {...attributes}
      onClick={isReadOnly ? onToggleExpand : undefined}
      className="yoopta-accordion-list-item-heading yoo-accordion-group">
      <span className="yoo-accordion-break-words hover:yoo-accordion-underline">{children}</span>
      <div className="yoo-accordion-absolute yoo-accordion-right-[14px] yoo-accordion-z-10 yoo-accordion-top-1/2 -yoo-accordion-translate-y-1/2 yoo-accordion-flex yoo-accordion-gap-1 yoo-accordion-select-none">
        {!isReadOnly && (
          <>
            <button
              type="button"
              contentEditable={false}
              onClick={onDeleteAccordionItem}
              className="yoopta-button yoo-accordion-opacity-0 group-hover:yoo-accordion-opacity-100 yoo-accordion-transition-opacity">
              <TrashIcon strokeWidth={1} size={16} color="#000" />
            </button>
            <button
              type="button"
              contentEditable={false}
              onClick={onAddAccordionItem}
              className="yoopta-button yoo-accordion-mr-2 yoo-accordion-opacity-0 group-hover:yoo-accordion-opacity-100 yoo-accordion-transition-opacity">
              <Plus strokeWidth={1} size={20} color="#000" />
            </button>
          </>
        )}
        <button
          type="button"
          contentEditable={false}
          onClick={onToggleExpand}
          className="yoopta-button">
          <ChevronUp
            strokeWidth={1}
            size={20}
            color="#000"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            className="yoo-accordion-transition-transform yoo-accordion-duration-200"
          />
        </button>
      </div>
    </div>
  );
};
