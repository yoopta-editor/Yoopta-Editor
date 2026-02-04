import { useSlashCommandContext } from '../context/slash-command-context';

export type SlashCommandEmptyProps = {
  children?: React.ReactNode;
  className?: string;
};

export const SlashCommandEmpty = ({ children, className }: SlashCommandEmptyProps) => {
  const { filteredItems } = useSlashCommandContext();

  if (filteredItems.length > 0) return null;

  return (
    <div className={`yoopta-ui-slash-command-empty ${className || ''}`}>{children || 'No results found'}</div>
  );
};

SlashCommandEmpty.displayName = 'SlashCommand.Empty';
