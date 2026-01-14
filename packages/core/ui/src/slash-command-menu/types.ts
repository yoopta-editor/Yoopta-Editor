import type { CSSProperties, MutableRefObject, ReactNode } from 'react';
import type { VirtualElement } from '@floating-ui/dom';
import type { FloatingContext } from '@floating-ui/react';

export type SlashCommandItem = {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  keywords?: string[];
  group?: string;
  disabled?: boolean;
  onSelect?: () => void;
};

export type SlashCommandGroup = {
  id: string;
  label: string;
  items: SlashCommandItem[];
};

export type MenuPosition = {
  x: number;
  y: number;
};

export type SlashCommandState = {
  isOpen: boolean;
  search: string;
  selectedIndex: number;
  virtualElement: VirtualElement | null;
  floatingContext: FloatingContext<VirtualElement> | null;
};

export type SlashCommandActions = {
  open: (virtualElement: VirtualElement, floatingContext: FloatingContext<VirtualElement>) => void;
  close: () => void;
  setSearch: (search: string) => void;
  selectItem: (index: number) => void;
  executeSelected: () => void;
};

export type SlashCommandContextValue = {
  state: SlashCommandState;
  actionHandlers: SlashCommandActions;
  items: SlashCommandItem[];
  filteredItems: SlashCommandItem[];
  groupedItems: Map<string, SlashCommandItem[]>;
  refs: {
    reference: MutableRefObject<VirtualElement | null>;
    floating: MutableRefObject<HTMLElement | null>;
    setReference: (node: VirtualElement | null) => void;
    setFloating: (node: HTMLElement | null) => void;
  };
  floatingStyles: CSSProperties;
};
