import type React from 'react';

export type SlashCommandFooterProps = {
  children?: React.ReactNode;
  className?: string;
  showHints?: boolean;
};

const DefaultHints = () => (
  <>
    <div className="yoopta-ui-slash-command-footer-hint">
      <kbd className="yoopta-ui-slash-command-kbd">↑</kbd>
      <kbd className="yoopta-ui-slash-command-kbd">↓</kbd>
      <span>Navigate</span>
    </div>
    <div className="yoopta-ui-slash-command-footer-hint">
      <kbd className="yoopta-ui-slash-command-kbd">↵</kbd>
      <span>Select</span>
    </div>
    <div className="yoopta-ui-slash-command-footer-hint">
      <kbd className="yoopta-ui-slash-command-kbd">Esc</kbd>
      <span>Close</span>
    </div>
  </>
);

export const SlashCommandFooter = ({
  children,
  className,
  showHints = true,
}: SlashCommandFooterProps) => (
  <div className={`yoopta-ui-slash-command-footer ${className || ''}`}>
    {children || (showHints && <DefaultHints />)}
  </div>
);

SlashCommandFooter.displayName = 'SlashCommand.Footer';
