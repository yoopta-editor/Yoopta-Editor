import { useSlashCommandContext } from '../context/SlashCommandContext';

// ============================================================================
// TYPES
// ============================================================================

export type SlashCommandEmptyProps = {
  children?: React.ReactNode;
  className?: string;
};

// ============================================================================
// COMPONENT
// ============================================================================

export const SlashCommandEmpty = ({ children, className }: SlashCommandEmptyProps) => {
  const { filteredItems } = useSlashCommandContext();

  // Only show when there are no filtered items
  if (filteredItems.length > 0) return null;

  return (
    <div className={`slash-command-empty ${className || ''}`}>{children || 'No results found'}</div>
  );
};

SlashCommandEmpty.displayName = 'SlashCommand.Empty';
