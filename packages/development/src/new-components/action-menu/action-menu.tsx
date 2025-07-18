import { useYooptaEditor } from '@yoopta/editor';
import { ActionMenu as ActionMenuUI, ActionMenuProvider, useActionMenu } from '@yoopta/ui';
import { useCallback } from 'react';

export const ActionMenu = () => {
  const editor = useYooptaEditor();

  const { actions, selectedAction, empty, onSelect, onNavigate, onConfirm, onMouseEnter } = useActionMenu({
    editor,
    trigger: '/',
    mode: 'create',
  });

  const handleItemClick = useCallback(
    (type: string) => {
      onSelect(type);
      onConfirm();
    },
    [onSelect, onConfirm],
  );

  const handleItemMouseEnter = useCallback(
    (type: string) => {
      onMouseEnter(type);
    },
    [onMouseEnter],
  );

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
                description={action.description}
                selected={selectedAction?.type === action.type}
                onClick={() => handleItemClick(action.type)}
                onMouseEnter={() => handleItemMouseEnter(action.type)}
                data-action-menu-item
                data-action-menu-item-type={action.type}
              />
            ))
          )}
        </ActionMenuUI.List>
      </ActionMenuUI.Content>
    </ActionMenuUI.Root>
  );
};

export { ActionMenuProvider };
