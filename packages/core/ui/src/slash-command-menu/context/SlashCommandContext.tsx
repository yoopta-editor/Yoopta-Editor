import { createContext, useContext } from 'react';

import type { SlashCommandContextValue } from '../types';

// ============================================================================
// CONTEXT
// ============================================================================

export const SlashCommandContext = createContext<SlashCommandContextValue | null>(null);

SlashCommandContext.displayName = 'SlashCommandContext';

// ============================================================================
// HOOK
// ============================================================================

export function useSlashCommandContext(): SlashCommandContextValue {
  const context = useContext(SlashCommandContext);

  if (!context) {
    throw new Error('useSlashCommandContext must be used within a SlashCommandProvider');
  }

  return context;
}

// ============================================================================
// SELECTORS (for optimized re-renders)
// ============================================================================

export function useSlashCommandState() {
  const { state } = useSlashCommandContext();
  return state;
}

export function useSlashCommandActions() {
  const { actions } = useSlashCommandContext();
  return actions;
}

export function useSlashCommandItems() {
  const { filteredItems, groupedItems } = useSlashCommandContext();
  return { filteredItems, groupedItems };
}

export function useSlashCommandRefs() {
  const { refs, floatingStyles } = useSlashCommandContext();
  return { refs, floatingStyles };
}
