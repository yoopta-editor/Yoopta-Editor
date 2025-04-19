import { Elements, PluginElementRenderProps, useBlockData, useYooptaEditor } from '@yoopta/editor';
import { Check } from 'lucide-react';
import { TodoListElementProps } from '../types';
import { cn } from '../utils/cn';

const TodoListRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { attributes, element, children, blockId, HTMLAttributes = {} } = props;
  const editor = useYooptaEditor();
  const block = useBlockData(blockId);

  const { className = '', ...htmlAttrs } = HTMLAttributes;
  const { checked = false } = (element.props || {}) as TodoListElementProps;

  const currentAlign = block?.meta?.align || 'left';

  if (extendRender) {
    return extendRender(props);
  }

  return (
    <div
      className={cn('yoopta-todo-list yoo-lists-group', `yoo-lists-text-${currentAlign}`, className)}
      data-checked={checked}
      {...htmlAttrs}
      {...attributes}
    >
      <button
        type="button"
        onClick={() =>
          Elements.updateElement(editor, blockId, {
            type: 'todo-list',
            props: { checked: !checked },
          })
        }
        className={cn(
          'yoopta-todo-list-checkbox',
          checked ? 'yoopta-todo-list-checkbox--checked' : 'yoopta-todo-list-checkbox--unchecked',
        )}
        contentEditable={false}
      >
        <Check
          className={cn(
            'yoopta-todo-list-checkbox-icon',
            checked ? 'yoopta-todo-list-checkbox-icon--checked' : 'yoopta-todo-list-checkbox-icon--unchecked',
          )}
        />
        <input
          type="checkbox"
          className="yoopta-todo-list-checkbox-input"
          checked={checked}
          disabled={editor.readOnly}
          onChange={() => {}}
        />
      </button>

      <div
        className={cn('yoopta-todo-list-content', checked && 'yoopta-todo-list-content--checked')}
        style={{
          textDecoration: checked ? 'line-through' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export { TodoListRender };
