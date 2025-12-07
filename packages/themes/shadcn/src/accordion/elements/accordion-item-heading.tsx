import { useCallback, useMemo } from 'react';
import type { MouseEvent } from 'react';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { ChevronDown } from 'lucide-react';
import { Editor, Element, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

export const AccordionItemHeading = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();

  // Find parent accordion-list-item element using Slate API
  const listItemEntry = useMemo(() => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });

    if (!slate) return undefined;

    try {
      const elementPath = ReactEditor.findPath(slate, element as SlateElement);
      const parentPath = Path.parent(elementPath);

      const [parentNode] = Editor.node(slate, parentPath);
      if (
        Element.isElement(parentNode) &&
        (parentNode as SlateElement).type === 'accordion-list-item'
      ) {
        return [parentNode as SlateElement, parentPath] as const;
      }
    } catch (error) {
      // Element not found in Slate tree
    }

    return undefined;
  }, [editor, blockId, element]);

  const isExpanded = listItemEntry?.[0]?.props?.isExpanded ?? false;

  const toggleAccordionItem = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const slate = Blocks.getBlockSlate(editor, { id: blockId });

      if (!slate || !listItemEntry) return;

      const [listItem, listItemPath] = listItemEntry;

      Editor.withoutNormalizing(slate, () => {
        Transforms.setNodes<SlateElement>(
          slate,
          { props: { ...listItem.props, isExpanded: !isExpanded } },
          { at: listItemPath },
        );
      });
    },
    [editor, blockId, listItemEntry, isExpanded],
  );

  return (
    <div
      {...attributes}
      className="flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all px-5">
      <div className="flex-1 min-w-0">{children}</div>
      <button
        type="button"
        contentEditable={false}
        onMouseDown={toggleAccordionItem}
        className="flex shrink-0 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        aria-label="Toggle accordion">
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
};
