import { type ReactNode, useMemo } from 'react';

import { SlashCommandContext } from '../context/SlashCommandContext';
import { useSlashCommand } from '../hooks/useSlashCommand';
import type { SlashCommandContextValue, SlashCommandItem } from '../types';

import '../slash-command.css';

export type SlashCommandRootProps = {
  children: ReactNode;
  items: SlashCommandItem[];
  trigger?: string;
  onSelect?: (item: SlashCommandItem) => void;
  className?: string;
};

export const SlashCommandRoot = ({
  children,
  items,
  trigger = '/',
  onSelect,
  className,
}: SlashCommandRootProps) => {
  const {
    state,
    actions,
    filteredItems,
    groupedItems,
    refs,
    floatingStyles,
    transitionStyles,
    isMounted,
  } = useSlashCommand({
    items,
    trigger,
    onSelect,
  });

  const contextValue: SlashCommandContextValue = useMemo(
    () => ({
      state,
      actions,
      items,
      filteredItems,
      groupedItems,
      refs,
      floatingStyles,
    }),
    [state, actions, items, filteredItems, groupedItems, refs, floatingStyles],
  );

  const style = { ...floatingStyles, ...transitionStyles };

  return (
    <SlashCommandContext.Provider value={contextValue}>
      <div ref={refs.setFloating} style={style} className={`slash-command-root ${className || ''}`}>
        {isMounted ? children : null}
      </div>
    </SlashCommandContext.Provider>
  );
};

SlashCommandRoot.displayName = 'SlashCommand.Root';
