import type { MouseEvent } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Elements, useYooptaEditor } from '@yoopta/editor';
import { Check } from 'lucide-react';

import { cn } from '../../../utils';

export const TodoList = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const isChecked = element.props.checked;
  const editor = useYooptaEditor();

  const toggleChecked = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    Elements.updateElement(editor, {
      blockId,
      type: 'todo-list',
      props: {
        checked: !isChecked,
      },
    });
  };

  return (
    <div {...attributes} className="m-0 mt-2 ml-6 list-none">
      <div className="flex items-start gap-2 pl-2">
        <button
          type="button"
          contentEditable={false}
          onMouseDown={toggleChecked}
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
      </div>
    </div>
  );
};
