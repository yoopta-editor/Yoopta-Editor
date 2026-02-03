import type { ReactElement } from 'react';
import { cloneElement, forwardRef, useEffect, useState } from 'react';
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

import './highlight-color-picker.css';

export type HighlightColorPickerProps = {
  /** Current color values (hex format) */
  value?: {
    color?: string;
    backgroundColor?: string;
  };
  /** Callback when color changes */
  onChange?: (values: { color?: string; backgroundColor?: string }) => void;
  /** Preset colors to display */
  presets?: string[];
  /** Show hex input field */
  showInput?: boolean;
  /** Custom className */
  className?: string;
  /** Trigger element */
  children: ReactElement;
  /** Placement of the popover */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Offset from trigger */
  offset?: number;
};

const DEFAULT_PRESETS = [
  '#FFFF00',
  '#FFE066',
  '#FFCC99',
  '#FF9999',
  '#99CCFF',
  '#99FF99',
  '#FF99FF',
  '#CC99FF',
];

export const HighlightColorPicker = forwardRef<HTMLDivElement, HighlightColorPickerProps>(
  (
    {
      value = { backgroundColor: '#FFFF00' },
      onChange,
      presets = DEFAULT_PRESETS,
      showInput = true,
      className,
      children,
      placement = 'bottom',
      offset: offsetValue = 8,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'color' | 'backgroundColor'>('backgroundColor');
    const [color, setColor] = useState(value.backgroundColor);
    const [textColor, setTextColor] = useState(value.color);

    const { refs, floatingStyles } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement,
      middleware: [offset(offsetValue), flip(), shift()],
      whileElementsMounted: autoUpdate,
    });

    useEffect(() => {
      if (value.backgroundColor) {
        setColor(value.backgroundColor);
      }
      if (value.color) {
        setTextColor(value.color);
      }
    }, [value]);

    // Close on outside click
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        const referenceEl = refs.reference.current;
        const floatingEl = refs.floating.current;

        // `referenceEl` may be a VirtualElement (no `contains`)
        if (referenceEl && referenceEl instanceof Element && referenceEl.contains(target)) return;
        if (floatingEl?.contains(target)) return;

        setIsOpen(false);
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, refs.floating, refs.reference]);

    const handleColorChange = (newColor: string) => {
      if (mode === 'backgroundColor') {
        setColor(newColor);
        onChange?.({ ...value, backgroundColor: newColor });
      } else {
        setTextColor(newColor);
        onChange?.({ ...value, color: newColor });
      }
    };

    const currentColor = mode === 'backgroundColor' ? color : textColor;

    const trigger = cloneElement(children, {
      ref: refs.setReference,
      onClick: (e: MouseEvent) => {
        e.stopPropagation();
        setIsOpen((v) => !v);
        children.props.onClick?.(e);
      },
    });

    const setFloatingRef = (node: HTMLDivElement | null) => {
      refs.setFloating(node);
      if (!ref) return;
      if (typeof ref === 'function') ref(node);
      else {
        // eslint-disable-next-line no-param-reassign
        ref.current = node;
      }
    };

    return (
      <>
        {trigger}
        {isOpen && (
          <div
            ref={setFloatingRef}
            style={floatingStyles}
            className={`yoopta-ui-highlight-color-picker ${className ?? ''}`}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}>
            {/* Mode Toggle */}
            <div className="yoopta-ui-highlight-color-picker-mode-toggle">
              <button
                type="button"
                className="yoopta-ui-highlight-color-picker-mode-btn"
                data-active={mode === 'backgroundColor'}
                onClick={() => setMode('backgroundColor')}
                aria-label="Background color">
                Background
              </button>
              <button
                type="button"
                className="yoopta-ui-highlight-color-picker-mode-btn"
                data-active={mode === 'color'}
                onClick={() => setMode('color')}
                aria-label="Text color">
                Text
              </button>
            </div>

            <div className="yoopta-ui-highlight-color-picker-picker">
              <HexColorPicker
                color={currentColor}
                onChange={handleColorChange}
                className="yoopta-ui-highlight-color-picker-react-colorful"
              />
            </div>

            {presets.length > 0 && (
              <div className="yoopta-ui-highlight-color-picker-presets">
                {presets.map((presetColor) => {
                  const isSelected = currentColor?.toLowerCase() === presetColor.toLowerCase();
                  return (
                    <button
                      key={presetColor}
                      type="button"
                      className="yoopta-ui-highlight-color-picker-preset"
                      data-selected={isSelected}
                      style={{ backgroundColor: presetColor }}
                      onClick={() => handleColorChange(presetColor)}
                      aria-label={`Select color ${presetColor}`}
                    />
                  );
                })}
              </div>
            )}

            {showInput && (
              <div className="yoopta-ui-highlight-color-picker-hex-row">
                <div
                  className="yoopta-ui-highlight-color-picker-swatch"
                  style={{ backgroundColor: currentColor }}
                />
                <HexColorInput
                  color={currentColor}
                  onChange={handleColorChange}
                  className="yoopta-ui-highlight-color-picker-hex-input"
                  prefixed
                />
              </div>
            )}
          </div>
        )}
      </>
    );
  },
);

HighlightColorPicker.displayName = 'HighlightColorPicker';

