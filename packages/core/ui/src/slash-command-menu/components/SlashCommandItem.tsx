import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { useSlashCommandContext } from '../context/SlashCommandContext';

export type SlashCommandItemProps = {
  children?: ReactNode;
  value: string;
  title?: string;
  description?: string;
  icon?: ReactNode;
  shortcut?: string[];
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
};

export const SlashCommandItem = ({
  children,
  value,
  title,
  description,
  icon,
  shortcut,
  disabled = false,
  onSelect,
  className,
}: SlashCommandItemProps) => {
  const { state, actionHandlers, filteredItems } = useSlashCommandContext();
  const itemRef = useRef<HTMLButtonElement>(null);

  // Find index of this item in filtered list
  const itemIndex = filteredItems.findIndex((item) => item.id === value);
  const isSelected = itemIndex === state.selectedIndex && itemIndex !== -1;
  const isVisible = itemIndex !== -1;

  useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [isSelected]);

  const handleClick = useCallback(() => {
    if (disabled) return;

    if (onSelect) {
      onSelect();
    }

    actionHandlers.selectItem(itemIndex);
    actionHandlers.executeSelected();
  }, [disabled, onSelect, actionHandlers, itemIndex]);

  const handleMouseEnter = useCallback(() => {
    if (!disabled && itemIndex !== -1) {
      actionHandlers.selectItem(itemIndex);
    }
  }, [disabled, itemIndex, actionHandlers]);

  if (!isVisible) return null;

  const content = children || (
    <>
      {icon && <div className="yoopta-ui-slash-command-item-icon">{icon}</div>}
      <div className="yoopta-ui-slash-command-item-content">
        {title && <div className="yoopta-ui-slash-command-item-title">{title}</div>}
        {description && <div className="yoopta-ui-slash-command-item-description">{description}</div>}
      </div>
      {shortcut && shortcut.length > 0 && (
        <div className="yoopta-ui-slash-command-item-shortcut">
          {shortcut.map((key) => (
            <kbd key={key} className="yoopta-ui-slash-command-kbd">
              {key}
            </kbd>
          ))}
        </div>
      )}
    </>
  );

  return (
    <button
      ref={itemRef}
      type="button"
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      data-selected={isSelected}
      data-disabled={disabled}
      data-value={value}
      className={`yoopta-ui-slash-command-item ${className || ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseDown={(e) => e.preventDefault()}
      disabled={disabled}>
      {content}
    </button>
  );
};

SlashCommandItem.displayName = 'SlashCommand.Item';
