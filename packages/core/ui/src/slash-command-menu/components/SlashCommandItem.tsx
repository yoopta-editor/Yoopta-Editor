import { useCallback, useEffect, useRef } from 'react';

import { useSlashCommandContext } from '../context/SlashCommandContext';

export type SlashCommandItemProps = {
  children?: React.ReactNode;
  value: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
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
  const { state, actions, filteredItems } = useSlashCommandContext();
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

    actions.selectItem(itemIndex);
    actions.executeSelected();
  }, [disabled, onSelect, actions, itemIndex]);

  const handleMouseEnter = useCallback(() => {
    if (!disabled && itemIndex !== -1) {
      actions.selectItem(itemIndex);
    }
  }, [disabled, itemIndex, actions]);

  if (!isVisible) return null;

  const content = children || (
    <>
      {icon && <div className="slash-command-item-icon">{icon}</div>}
      <div className="slash-command-item-content">
        {title && <div className="slash-command-item-title">{title}</div>}
        {description && <div className="slash-command-item-description">{description}</div>}
      </div>
      {shortcut && shortcut.length > 0 && (
        <div className="slash-command-item-shortcut">
          {shortcut.map((key) => (
            <kbd key={key} className="slash-command-kbd">
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
      className={`slash-command-item ${className || ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseDown={(e) => e.preventDefault()}
      disabled={disabled}>
      {content}
    </button>
  );
};

SlashCommandItem.displayName = 'SlashCommand.Item';
