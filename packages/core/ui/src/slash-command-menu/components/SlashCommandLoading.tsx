import type { ReactNode } from 'react';

export type SlashCommandLoadingProps = {
  children?: ReactNode;
  className?: string;
};

export const SlashCommandLoading = ({ children, className }: SlashCommandLoadingProps) => (
  <div className={`slash-command-loading ${className || ''}`}>
    {children || <div className="slash-command-spinner" />}
  </div>
);

SlashCommandLoading.displayName = 'SlashCommand.Loading';
