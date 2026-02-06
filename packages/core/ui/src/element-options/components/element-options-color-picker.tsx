import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { useYooptaEditor } from '@yoopta/editor';
import { HexColorInput, HexColorPicker } from 'react-colorful';

import { debounce } from '../../utils/debounce';
import type { ElementOptionsColorPickerProps } from '../types';

const DEFAULT_PRESET_COLORS = [
  '#000000',
  '#6B7280',
  '#EF4444',
  '#F59E0B',
  '#22C55E',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
];

const COLOR_PICKER_STYLES = {
  width: '100%'
}

export const ElementOptionsColorPicker = ({
  value,
  onChange,
  presetColors = DEFAULT_PRESET_COLORS,
  className,
  style,
}: ElementOptionsColorPickerProps) => {
  const editor = useYooptaEditor();
  const [localColor, setLocalColor] = useState(value);

  // Keep value ref for debounced callback
  const valueRef = useRef(value);
  valueRef.current = value;

  // Sync local state when external value changes
  useEffect(() => {
    setLocalColor(value);
  }, [value]);

  // Debounced onChange to prevent flooding undo/redo history during color picker drag
  const debouncedOnChange = useMemo(
    () =>
      debounce((newColor: string) => {
        onChange(newColor);
      }, 300),
    [onChange],
  );

  // Cleanup debounce on unmount
  useEffect(
    () => () => {
      debouncedOnChange.cancel();
    },
    [debouncedOnChange],
  );

  // Handler for color picker (continuous changes) - uses debounce
  const handlePickerChange = useCallback(
    (newColor: string) => {
      setLocalColor(newColor);
      debouncedOnChange(newColor);
    },
    [debouncedOnChange],
  );

  // Handler for presets and hex input (discrete changes) - immediate
  const handleColorChange = useCallback(
    (newColor: string) => {
      debouncedOnChange.cancel();
      setLocalColor(newColor);
      onChange(newColor);
    },
    [onChange, debouncedOnChange],
  );

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={className}
          style={style}
          onMouseDown={(e) => e.preventDefault()}
          data-element-options-color-picker>
          <span data-element-options-color-preview style={{ backgroundColor: localColor }} />
          <span data-element-options-color-value>{localColor}</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal container={editor.refElement}>
        <Popover.Content
          data-element-options-color-picker-content
          side="bottom"
          align="start"
          sideOffset={4}
          collisionPadding={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            // Flush pending changes when closing
            debouncedOnChange.flush();
          }}
          onMouseDown={(e) => e.preventDefault()}>
          <HexColorPicker
            color={localColor}
            onChange={handlePickerChange}
            data-element-options-color-picker-picker
            style={COLOR_PICKER_STYLES}
          />

          {presetColors.length > 0 && (
            <div data-element-options-color-presets>
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  data-element-options-color-preset
                  data-selected={color.toLowerCase() === localColor?.toLowerCase()}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          )}

          <div data-element-options-color-hex-row>
            <div data-element-options-color-swatch style={{ backgroundColor: localColor }} />
            <HexColorInput
              color={localColor}
              onChange={handleColorChange}
              data-element-options-color-hex-input
              prefixed
            />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

ElementOptionsColorPicker.displayName = 'ElementOptions.ColorPicker';
