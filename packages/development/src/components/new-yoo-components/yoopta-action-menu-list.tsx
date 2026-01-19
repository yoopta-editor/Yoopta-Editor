import { COMMAND_MENU_DEFAULT_ICONS_MAP } from '@/icons/icons';
import {
  ActionMenuList,
  useActionMenuList,
  useBlockOptionsActions,
  useFloatingBlockActions,
} from '@yoopta/ui';

export const YooptaActionMenuList = () => {
  const { close: closeBlockOptions } = useBlockOptionsActions();
  const { toggle: toggleFloatingBlockActions } = useFloatingBlockActions();
  const { actions, selectedAction, empty, isOpen, getItemProps, getRootProps } =
    useActionMenuList();

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
            const onClick = (e: React.MouseEvent) => {
              itemProps.onClick(e);
              closeBlockOptions();
              toggleFloatingBlockActions('hovering');
            };

            return (
              <ActionMenuList.Item
                key={action.type}
                action={action}
                selected={action.type === selectedAction?.type}
                icon={Icon ? <Icon width={20} height={20} /> : null}
                {...itemProps}
                onClick={onClick}
              />
            );
          })
        )}
      </ActionMenuList.Group>
    </ActionMenuList.Root>
  );
};
