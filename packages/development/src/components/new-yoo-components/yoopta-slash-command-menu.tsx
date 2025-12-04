import { ACTION_MENU_LIST_DEFAULT_ICONS_MAP } from '@/icons/icons';
import { SlashActionMenuList } from '@yoopta/ui';
import { useSlashActionMenu } from '@yoopta/ui';

export const YooptaSlashCommandMenu = () => {
  const { actions, selectedAction, empty, isOpen, getItemProps, getRootProps } = useSlashActionMenu(
    { trigger: '/' },
  );

  if (!isOpen) return null;

  return (
    <SlashActionMenuList.Root {...getRootProps()}>
      <SlashActionMenuList.Group>
        {empty ? (
          <SlashActionMenuList.Empty />
        ) : (
          actions.map((action) => {
            const Icon = ACTION_MENU_LIST_DEFAULT_ICONS_MAP[action.type];

            return (
              <SlashActionMenuList.Item
                key={action.type}
                action={action}
                selected={action.type === selectedAction?.type}
                icon={Icon ? <Icon width={20} height={20} /> : null}
                {...getItemProps(action.type)}
              />
            );
          })
        )}
      </SlashActionMenuList.Group>
    </SlashActionMenuList.Root>
  );
};
