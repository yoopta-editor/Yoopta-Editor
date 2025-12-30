import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { Check } from 'lucide-react';
import { Editor, Element, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { cn } from '../../../utils';

export const TodoListItem = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();

  const isChecked = element.props?.checked;

  const toggleChecked = () => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    try {
      const elementPath = ReactEditor.findPath(slate, element as SlateElement);
      const [node] = Editor.node(slate, elementPath);

      if (Element.isElement(node)) {
        const todoElement = node as SlateElement<'todo-list-item', { checked?: boolean }>;
        const currentChecked = todoElement.props?.checked ?? false;

        Editor.withoutNormalizing(slate, () => {
          Transforms.setNodes<SlateElement>(
            slate,
            { props: { ...todoElement.props, checked: !currentChecked } },
            { at: elementPath },
          );
        });
      }
    } catch (error) {
      // Element not found in Slate tree
    }
  };

  return (
    <li {...attributes} className="flex items-start gap-2 pl-2">
      <button
        type="button"
        contentEditable={false}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleChecked();
        }}
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 transition-colors',
          isChecked
            ? 'bg-primary border-primary text-primary-foreground'
            : 'border-input bg-background',
        )}
        aria-label={isChecked ? 'Mark as unchecked' : 'Mark as checked'}>
        {isChecked && <Check className="h-3 w-3" />}
      </button>
      <span className={cn('flex-1', isChecked && 'text-muted-foreground line-through')}>
        {children}
      </span>
    </li>
  );
};
