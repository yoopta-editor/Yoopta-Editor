export type SlashCommandSeparatorProps = {
  className?: string;
};

// ============================================================================
// COMPONENT
// ============================================================================

export const SlashCommandSeparator = ({ className }: SlashCommandSeparatorProps) => (
  <div
    role="separator"
    aria-orientation="horizontal"
    className={`slash-command-separator ${className || ''}`}
  />
);

SlashCommandSeparator.displayName = 'SlashCommand.Separator';
