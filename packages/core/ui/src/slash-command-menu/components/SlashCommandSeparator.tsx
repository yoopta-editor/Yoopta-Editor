export type SlashCommandSeparatorProps = {
  className?: string;
};

export const SlashCommandSeparator = ({ className }: SlashCommandSeparatorProps) => (
  <div
    role="separator"
    aria-orientation="horizontal"
    className={`yoopta-ui-slash-command-separator ${className || ''}`}
  />
);

SlashCommandSeparator.displayName = 'SlashCommand.Separator';
