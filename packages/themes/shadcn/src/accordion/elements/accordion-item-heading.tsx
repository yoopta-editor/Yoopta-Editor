import { useCallback, useMemo, useReducer } from 'react';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { Location } from 'slate';
import { Editor, Path, Transforms } from 'slate';

import { AccordionTrigger } from '../../ui/accordion';

export const AccordionItemHeading = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();
  const [, forceRerender] = useReducer((x) => x + 1, 0);

  const parentListItem = useMemo(() => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return undefined;

    try {
      const elementPath = Elements.getElementPath(editor, {
        blockId,
        element,
      });
      const parentElement = Editor.parent(slate, elementPath as Location);
      return parentElement[0] as SlateElement;
    } catch (error) {
      // Element path not found
    }

    return undefined;
  }, [editor, blockId, element]);

  const parentListItemPath = useMemo(() => {
    if (!parentListItem) return undefined;

    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return undefined;

    try {
      return Elements.getElementPath(editor, { blockId, element: parentListItem });
    } catch (error) {
      // Element path not found
    }

    return undefined;
  }, [editor, blockId, parentListItem]);

  const isExpanded = parentListItem?.props?.isExpanded ?? false;

  const toggleListItem = useCallback(() => {
    if (parentListItem && parentListItemPath) {
      Elements.updateElement(editor, {
        blockId,
        type: parentListItem.type,
        props: {
          ...parentListItem.props,
          isExpanded: !isExpanded,
        },
        path: parentListItemPath,
      });
    }

    forceRerender();
  }, [editor, blockId, parentListItem, parentListItemPath, isExpanded]);

  const deleteListItem = useCallback(
    (e: React.MouseEvent) => {
      if (editor.readOnly) return;
      e.preventDefault();
      e.stopPropagation();

      if (!parentListItem || !parentListItemPath) return;

      // Get all accordion-list-item children to check if this is the last one
      const listItems = Elements.getElementChildren(editor, {
        blockId,
        type: 'accordion-list',
      });

      if (listItems?.length === 1) {
        Blocks.deleteBlock(editor, { blockId });
        return;
      }

      Elements.deleteElement(editor, {
        blockId,
        type: 'accordion-list-item',
        path: parentListItemPath,
      });
    },
    [editor, blockId, parentListItem, parentListItemPath],
  );

  const addListItem = useCallback(
    (e: React.MouseEvent) => {
      if (editor.readOnly) return;
      e.preventDefault();
      e.stopPropagation();

      const slate = Blocks.getBlockSlate(editor, { id: blockId });
      if (!slate || !parentListItemPath) return;

      // Create new accordion-list-item using editor.y()
      const newListItem = editor.y('accordion-list-item', {
        props: { isExpanded: false },
        children: [
          editor.y('accordion-list-item-heading'),
          editor.y('accordion-list-item-content'),
        ],
      });

      Editor.withoutNormalizing(slate, () => {
        const nextListItemPath = Path.next(parentListItemPath);
        Transforms.insertNodes(slate, newListItem, { at: nextListItemPath });
        const nextLeafPath = [...nextListItemPath, 0, 0];

        setTimeout(() => {
          Transforms.select(slate, { offset: 0, path: nextLeafPath });
        }, 0);
      });
    },
    [editor, blockId, parentListItemPath],
  );

  return (
    <div
      {...attributes}
      className="flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all px-5">
      <div className="flex-1 min-w-0">{children}</div>

      <div className="flex shrink-0 items-center gap-1" contentEditable={false}>
        {!editor.readOnly && (
          <button
            type="button"
            contentEditable={false}
            onClick={addListItem}
            className="flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-1"
            title="Add accordion item">
            <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        )}
        {!editor.readOnly && (
          <button
            type="button"
            contentEditable={false}
            onClick={deleteListItem}
            className="flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-1"
            title="Delete accordion item">
            <Trash2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        )}
        <AccordionTrigger
          type="button"
          contentEditable={false}
          data-slot="accordion-trigger"
          onClick={toggleListItem}
          className="flex shrink-0 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
              }`}
          />
        </AccordionTrigger>
      </div>
    </div>
  );
};
