import React from 'react';
import { SlashCommandMenu } from '@yoopta/ui/slash-command-menu';

export const SlashMenu = () => {
  return (
    <SlashCommandMenu.Root>
      {(props) => {
        return (
          <SlashCommandMenu.Content>
            <SlashCommandMenu.List>
              <SlashCommandMenu.Empty>No blocks found</SlashCommandMenu.Empty>
              {props.items.map((item) => {
                return (
                  <SlashCommandMenu.Item key={item.id} value={item.id} title={item.title} description={item.description} icon={item.icon} />
                );
              })}
            </SlashCommandMenu.List>
          </SlashCommandMenu.Content>
        );
      }}
    </SlashCommandMenu.Root>
  );
};