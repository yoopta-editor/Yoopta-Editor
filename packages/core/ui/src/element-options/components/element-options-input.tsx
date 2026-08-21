import { useEffect, useRef, useState } from 'react';

import type { ElementOptionsInputProps } from '../types';

export const ElementOptionsInput = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
  style,
}: ElementOptionsInputProps) => {
  const [localValue, setLocalValue] = useState(value);
  const composingRef = useRef(false);

  useEffect(() => {
    if (!composingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setLocalValue(nextValue);
    if (!composingRef.current) {
      onChange(nextValue);
    }
  };

  const handleCompositionStart = () => {
    composingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    composingRef.current = false;
    const nextValue = e.currentTarget.value;
    setLocalValue(nextValue);
    onChange(nextValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <input
      type={type}
      value={localValue}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onMouseDown={handleMouseDown}
      placeholder={placeholder}
      className={className}
      style={style}
      data-element-options-input
    />
  );
};

ElementOptionsInput.displayName = 'ElementOptions.Input';

