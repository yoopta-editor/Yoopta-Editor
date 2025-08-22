import { useYooptaEditor } from '@yoopta/editor';
import { ActionMenu as ActionMenuUI, ActionMenuProvider, useActionMenu } from '@yoopta/ui';
import { useCallback } from 'react';

export const ActionMenu = () => {
  const editor = useYooptaEditor();

  const { actions, selectedAction, empty, isOpen, onSelect, onToggle, onMouseEnter } = useActionMenu({
    editor,
    trigger: '/',
    mode: 'create',
  });

  console.log('ActionMenu editor.path.current', editor.path.current);

  const onActionClick = (type: string) => {
    onSelect(type);
    console.log('onActionClick', { path: editor.path.current, type });
    onToggle({ path: editor.path.current });
  };

  if (!isOpen) return null;

  return (
    <ActionMenuUI.Root>
      <ActionMenuUI.Content>
        <ActionMenuUI.List>
          {empty ? (
            <ActionMenuUI.Empty />
          ) : (
            actions.map((action) => (
              <ActionMenuUI.Item
                key={action.type}
                icon={action.icon}
                title={action.title}
                type={action.type}
                description={action.description}
                selected={selectedAction?.type === action.type}
                onClick={() => onActionClick(action.type)}
                onMouseEnter={() => onMouseEnter(action.type)}
              />
            ))
          )}
        </ActionMenuUI.List>
      </ActionMenuUI.Content>
    </ActionMenuUI.Root>
  );
};

export { ActionMenuProvider };
