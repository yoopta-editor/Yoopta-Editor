import type { ReactNode } from 'react';

export type SlashCommandGroupProps = {
  children: ReactNode;
  heading?: string;
  className?: string;
};

// ============================================================================
// COMPONENT
// ============================================================================

export const SlashCommandGroup = ({ children, heading, className }: SlashCommandGroupProps) => (
  <div role="group" aria-label={heading} className={`slash-command-group ${className || ''}`}>
    {heading && <div className="slash-command-group-heading">{heading}</div>}
    {children}
  </div>
);

SlashCommandGroup.displayName = 'SlashCommand.Group';
