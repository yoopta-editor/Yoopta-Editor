import { useMemo } from 'react';

import type { SlashCommandItem } from '../types';

function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

function matchesSearch(item: SlashCommandItem, search: string): boolean {
  if (!search) return true;

  const normalizedSearch = normalizeString(search);

  if (normalizeString(item.title).includes(normalizedSearch)) {
    return true;
  }

  if (normalizeString(item.id).includes(normalizedSearch)) {
    return true;
  }

  if (item.description && normalizeString(item.description).includes(normalizedSearch)) {
    return true;
  }

  if (item.keywords?.some((keyword) => normalizeString(keyword).includes(normalizedSearch))) {
    return true;
  }

  return false;
}

function scoreItem(item: SlashCommandItem, search: string): number {
  if (!search) return 0;

  const normalizedSearch = normalizeString(search);
  const normalizedTitle = normalizeString(item.title);
  const normalizedId = normalizeString(item.id);

  if (normalizedTitle === normalizedSearch) return 100;

  if (normalizedTitle.startsWith(normalizedSearch)) return 80;

  if (normalizedId.startsWith(normalizedSearch)) return 70;

  if (item.keywords?.some((k) => normalizeString(k) === normalizedSearch)) return 60;

  if (normalizedTitle.includes(normalizedSearch)) return 50;

  if (item.keywords?.some((k) => normalizeString(k).startsWith(normalizedSearch))) return 40;

  if (item.keywords?.some((k) => normalizeString(k).includes(normalizedSearch))) return 30;

  if (item.description && normalizeString(item.description).includes(normalizedSearch)) return 20;

  return 10;
}

type UseFilterOptions = {
  items: SlashCommandItem[];
  search: string;
};

type UseFilterResult = {
  filteredItems: SlashCommandItem[];
  groupedItems: Map<string, SlashCommandItem[]>;
  isEmpty: boolean;
};

export function useFilter({ items, search }: UseFilterOptions): UseFilterResult {
  const filteredItems = useMemo(() => {
    const filtered = items.filter((item) => !item.disabled && matchesSearch(item, search));

    if (search) {
      filtered.sort((a, b) => scoreItem(b, search) - scoreItem(a, search));
    }

    return filtered;
  }, [items, search]);

  const groupedItems = useMemo(() => {
    const groups = new Map<string, SlashCommandItem[]>();

    filteredItems.forEach((item) => {
      const groupId = item.group || 'default';
      const existing = groups.get(groupId) || [];
      groups.set(groupId, [...existing, item]);
    });

    return groups;
  }, [filteredItems]);

  return {
    filteredItems,
    groupedItems,
    isEmpty: filteredItems.length === 0,
  };
}
