export type SlashCommandContentProps = {
  children: React.ReactNode;
  className?: string;
};

export const SlashCommandContent = ({ children, className }: SlashCommandContentProps) => {
  const preventDefault = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      tabIndex={0}
      role="listbox"
      aria-label="Slash commands"
      className={`slash-command-content ${className || ''}`}
      onMouseDown={preventDefault}
      onMouseMove={preventDefault}>
      {children}
    </div>
  );
};

SlashCommandContent.displayName = 'SlashCommand.Content';
