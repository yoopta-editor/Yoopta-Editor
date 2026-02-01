import { useEffect, useRef, useState } from 'react';
import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { useYooptaEditor } from '@yoopta/editor';
import { HexColorPicker } from 'react-colorful';

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

export const ElementOptionsColorPicker = ({
  value,
  onChange,
  presetColors = DEFAULT_PRESET_COLORS,
  className,
  style,
}: ElementOptionsColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const editor = useYooptaEditor();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (triggerRef.current) {
      refs.setReference(triggerRef.current);
    }
  }, [refs]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        refs.floating.current &&
        !refs.floating.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, refs.floating]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handlePresetClick = (color: string) => {
    onChange(color);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={className}
        style={style}
        onClick={handleTriggerClick}
        onMouseDown={handleMouseDown}
        data-element-options-color-picker
        data-state={isOpen ? 'open' : 'closed'}
        aria-expanded={isOpen}>
        <span
          data-element-options-color-preview
          style={{ backgroundColor: value }}
        />
        <span data-element-options-color-value>{value}</span>
      </button>

      {isOpen && (
        <FloatingPortal root={editor.refElement} id={`yoopta-ui-element-options-color-picker-portal-${editor.id}`}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            data-element-options-color-picker-content
            onMouseDown={handleMouseDown}>
            <HexColorPicker color={value} onChange={onChange} />

            {presetColors.length > 0 && (
              <div data-element-options-color-presets>
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    data-element-options-color-preset
                    data-selected={color === value}
                    style={{ backgroundColor: color }}
                    onClick={() => handlePresetClick(color)}
                    onMouseDown={handleMouseDown}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            )}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

ElementOptionsColorPicker.displayName = 'ElementOptions.ColorPicker';

