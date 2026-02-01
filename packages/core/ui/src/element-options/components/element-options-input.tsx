import type { ElementOptionsInputProps } from '../types';

export const ElementOptionsInput = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
  style,
}: ElementOptionsInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      onMouseDown={handleMouseDown}
      placeholder={placeholder}
      className={className}
      style={style}
      data-element-options-input
    />
  );
};

ElementOptionsInput.displayName = 'ElementOptions.Input';

