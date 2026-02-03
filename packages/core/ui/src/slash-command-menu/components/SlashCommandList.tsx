export type SlashCommandListProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const SlashCommandList = ({ children, className, style }: SlashCommandListProps) => (
  <div role="group" className={`yoopta-ui-slash-command-list ${className ?? ''}`} style={style}>
    {children}
  </div>
);

SlashCommandList.displayName = 'SlashCommand.List';
