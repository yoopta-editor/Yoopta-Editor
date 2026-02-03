import { forwardRef } from 'react';

import { useSlashCommandContext } from '../context/SlashCommandContext';

export type SlashCommandInputProps = {
  placeholder?: string;
  className?: string;
  showTrigger?: boolean;
  showEscHint?: boolean;
};

export const SlashCommandInput = forwardRef<HTMLInputElement, SlashCommandInputProps>(
  (
    { placeholder = 'Search blocks...', className, showTrigger = true, showEscHint = true },
    ref,
  ) => {
    const { state, actionHandlers } = useSlashCommandContext();

    return (
      <div className={`yoopta-ui-slash-command-input-wrapper ${className || ''}`}>
        {showTrigger && <span className="yoopta-ui-slash-command-input-trigger">/</span>}
        <input
          ref={ref}
          type="text"
          className="yoopta-ui-slash-command-input"
          placeholder={placeholder}
          value={state.search}
          onChange={(e) => actionHandlers.setSearch(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {showEscHint && <kbd className="yoopta-ui-slash-command-kbd">ESC</kbd>}
      </div>
    );
  },
);

SlashCommandInput.displayName = 'SlashCommand.Input';
