import { COMMAND_MENU_DEFAULT_ICONS_MAP } from '@/icons/icons';
import { ActionMenuList, useActionMenuList } from '@yoopta/ui/action-menu-list';

/**
 * Slash command menu - triggered by typing "/" in the editor.
 * This is independent of FloatingBlockActions/BlockOptions.
 */
export const YooptaActionMenuList = () => {
  const { actions, selectedAction, empty, isOpen, getItemProps, getRootProps } = useActionMenuList();

  if (!isOpen) return null;

  return (
    <ActionMenuList.Root {...getRootProps()}>
      <ActionMenuList.Group>
        {empty ? (
          <ActionMenuList.Empty />
        ) : (
          actions.map((action) => {
            const Icon = COMMAND_MENU_DEFAULT_ICONS_MAP[action.type];
            const itemProps = getItemProps(action.type);

            return (
              <ActionMenuList.Item
                key={action.type}
                action={action}
                selected={action.type === selectedAction?.type}
                icon={Icon ? <Icon width={20} height={20} /> : null}
                {...itemProps}
              />
            );
          })
        )}
      </ActionMenuList.Group>
    </ActionMenuList.Root>
  );
};
