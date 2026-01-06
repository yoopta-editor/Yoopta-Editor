import { forwardRef } from 'react';

export type SlashCommandListProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const SlashCommandList = forwardRef<HTMLDivElement, SlashCommandListProps>(
  ({ children, className, style }, ref) => (
    <div ref={ref} role="group" className={`slash-command-list ${className || ''}`} style={style}>
      {children}
    </div>
  ),
);

SlashCommandList.displayName = 'SlashCommand.List';
