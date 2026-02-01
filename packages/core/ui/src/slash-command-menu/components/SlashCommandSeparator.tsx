export type SlashCommandSeparatorProps = {
  className?: string;
};

export const SlashCommandSeparator = ({ className }: SlashCommandSeparatorProps) => (
  <div
    role="separator"
    aria-orientation="horizontal"
    className={`slash-command-separator ${className || ''}`}
  />
);

SlashCommandSeparator.displayName = 'SlashCommand.Separator';
