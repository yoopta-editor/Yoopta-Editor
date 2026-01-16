import { COMMAND_MENU_DEFAULT_ICONS_MAP } from '@/icons/icons';
import { SlashCommandMenu } from '@yoopta/ui';

export const YooptaSlashCommandMenu = () => (
  <SlashCommandMenu.Root>
    {(props) => {
      return (
        <SlashCommandMenu.Content>
          <SlashCommandMenu.List>
            <SlashCommandMenu.Empty>No blocks found</SlashCommandMenu.Empty>
            {props.items.map((item) => {
              const Icon = COMMAND_MENU_DEFAULT_ICONS_MAP[item.id];

              return (
                <SlashCommandMenu.Item
                  key={item.id}
                  value={item.id}
                  title={item.title}
                  description={item.description}
                  icon={Icon ? <Icon width={20} height={20} /> : null}
                />
              );
            })}
          </SlashCommandMenu.List>
          <SlashCommandMenu.Footer />
        </SlashCommandMenu.Content>
      );
    }}
  </SlashCommandMenu.Root>
);
