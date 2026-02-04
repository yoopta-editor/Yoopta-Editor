import type { ReactNode } from 'react';

export type SlashCommandLoadingProps = {
  children?: ReactNode;
  className?: string;
};

export const SlashCommandLoading = ({ children, className }: SlashCommandLoadingProps) => (
  <div className={`yoopta-ui-slash-command-loading ${className || ''}`}>
    {children || <div className="yoopta-ui-slash-command-spinner" />}
  </div>
);

SlashCommandLoading.displayName = 'SlashCommand.Loading';
