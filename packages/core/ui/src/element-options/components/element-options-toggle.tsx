import type { ElementOptionsToggleProps } from '../types';

export const ElementOptionsToggle = ({
  checked,
  onCheckedChange,
  label,
  className,
  style,
}: ElementOptionsToggleProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCheckedChange(!checked);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCheckedChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={className}
      style={style}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      data-element-options-toggle
      data-state={checked ? 'checked' : 'unchecked'}>
      <span data-element-options-toggle-thumb />
      {label && <span data-element-options-toggle-label>{label}</span>}
    </button>
  );
};

ElementOptionsToggle.displayName = 'ElementOptions.Toggle';

