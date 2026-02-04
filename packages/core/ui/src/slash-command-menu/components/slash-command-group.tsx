import type { ReactNode } from 'react';

export type SlashCommandGroupProps = {
  children: ReactNode;
  heading?: string;
  className?: string;
};

export const SlashCommandGroup = ({ children, heading, className }: SlashCommandGroupProps) => (
  <div role="group" aria-label={heading} className={`yoopta-ui-slash-command-group ${className || ''}`}>
    {heading && <div className="yoopta-ui-slash-command-group-heading">{heading}</div>}
    {children}
  </div>
);

SlashCommandGroup.displayName = 'SlashCommand.Group';
