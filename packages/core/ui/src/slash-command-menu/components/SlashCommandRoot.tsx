import { type ReactNode, useMemo } from 'react';
import { getRootBlockElementType, useYooptaEditor } from '@yoopta/editor';

import { SlashCommandContext } from '../context/SlashCommandContext';
import { useSlashCommand } from '../hooks/useSlashCommand';
import type { SlashCommandContextValue, SlashCommandItem } from '../types';

import '../slash-command.css';

export type SlashCommandRootProps = {
  children: ReactNode | ((props: SlashCommandRootChildrenProps) => ReactNode);
  items?: SlashCommandItem[];
  trigger?: string;
  onSelect?: (item: SlashCommandItem) => void;
  className?: string;
};

export type SlashCommandRootChildrenProps = {
  groupedItems: Map<string, SlashCommandItem[]>;
  items: SlashCommandItem[];
};

export const SlashCommandRoot = ({
  children,
  items: itemsProps,
  trigger = '/',
  onSelect,
  className,
}: SlashCommandRootProps) => {
  const editor = useYooptaEditor();

  const items = useMemo(() => {
    if (Array.isArray(itemsProps) && itemsProps.length > 0) {
      return itemsProps;
    }

    // filter elements where root element is inline
    const pluginTypes = Object.keys(editor.plugins).filter((pluginType) => {
      const rootElementType = getRootBlockElementType(editor.plugins[pluginType].elements);
      const rootElement = rootElementType
        ? editor.plugins[pluginType].elements[rootElementType]
        : undefined;
      return rootElement?.props?.nodeType === 'block' || rootElement?.props?.nodeType === 'void';
    });

    return pluginTypes.map((pluginType) => ({
      id: pluginType,
      title: editor.plugins[pluginType].options?.display?.title ?? pluginType,
      description: editor.plugins[pluginType].options?.display?.description,
    }));
  }, [itemsProps, editor]);

  const {
    state,
    actionHandlers,
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
      actionHandlers,
      items,
      filteredItems,
      groupedItems,
      refs,
      floatingStyles,
    }),
    [state, actionHandlers, items, filteredItems, groupedItems, refs, floatingStyles],
  );

  const style = { ...floatingStyles, ...transitionStyles };

  const childrenRender =
    typeof children === 'function' ? children({ groupedItems, items }) : children;

  return (
    <SlashCommandContext.Provider value={contextValue}>
      <div ref={refs.setFloating} style={style} className={`slash-command-root ${className ?? ''}`}>
        {isMounted ? childrenRender : null}
      </div>
    </SlashCommandContext.Provider>
  );
};

SlashCommandRoot.displayName = 'SlashCommand.Root';
