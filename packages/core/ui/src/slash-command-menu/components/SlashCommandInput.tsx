import { forwardRef } from 'react';

import { useSlashCommandContext } from '../context/SlashCommandContext';

// ============================================================================
// TYPES
// ============================================================================

export type SlashCommandInputProps = {
  placeholder?: string;
  className?: string;
  showTrigger?: boolean;
  showEscHint?: boolean;
};

// ============================================================================
// COMPONENT
// ============================================================================

export const SlashCommandInput = forwardRef<HTMLInputElement, SlashCommandInputProps>(
  (
    { placeholder = 'Search blocks...', className, showTrigger = true, showEscHint = true },
    ref,
  ) => {
    const { state, actions } = useSlashCommandContext();

    return (
      <div className={`slash-command-input-wrapper ${className || ''}`}>
        {showTrigger && <span className="slash-command-input-trigger">/</span>}
        <input
          ref={ref}
          type="text"
          className="slash-command-input"
          placeholder={placeholder}
          value={state.search}
          onChange={(e) => actions.setSearch(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {showEscHint && <kbd className="slash-command-kbd">ESC</kbd>}
      </div>
    );
  },
);

SlashCommandInput.displayName = 'SlashCommand.Input';
