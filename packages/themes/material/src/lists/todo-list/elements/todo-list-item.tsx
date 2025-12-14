import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { Editor, Element, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

export const TodoListItem = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();

  const isChecked = element.props?.checked ?? false;

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
    <Box
      {...attributes}
      component="li"
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        pl: 1,
      }}>
      <Checkbox
        checked={isChecked}
        onChange={toggleChecked}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        sx={{
          padding: 0.5,
          mt: 0.5,
        }}
        contentEditable={false}
      />
      <Box
        component="span"
        sx={{
          flex: 1,
          textDecoration: isChecked ? 'line-through' : 'none',
          color: isChecked ? 'text.secondary' : 'inherit',
        }}>
        {children}
      </Box>
    </Box>
  );
};
