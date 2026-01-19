import type React from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type SlashCommandFooterProps = {
  children?: React.ReactNode;
  className?: string;
  showHints?: boolean;
};

// ============================================================================
// DEFAULT HINTS
// ============================================================================

const DefaultHints = () => (
  <>
    <div className="slash-command-footer-hint">
      <kbd className="slash-command-kbd">↑</kbd>
      <kbd className="slash-command-kbd">↓</kbd>
      <span>Navigate</span>
    </div>
    <div className="slash-command-footer-hint">
      <kbd className="slash-command-kbd">↵</kbd>
      <span>Select</span>
    </div>
    <div className="slash-command-footer-hint">
      <kbd className="slash-command-kbd">Esc</kbd>
      <span>Close</span>
    </div>
  </>
);

// ============================================================================
// COMPONENT
// ============================================================================

export const SlashCommandFooter = ({
  children,
  className,
  showHints = true,
}: SlashCommandFooterProps) => (
  <div className={`slash-command-footer ${className || ''}`}>
    {children || (showHints && <DefaultHints />)}
  </div>
);

SlashCommandFooter.displayName = 'SlashCommand.Footer';
