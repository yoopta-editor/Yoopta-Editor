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
import { Check, ChevronDown } from 'lucide-react';

import type { ElementOptionsSelectProps, SelectOption } from '../types';

export const ElementOptionsSelect = <T extends string = string>({
  value,
  options,
  onValueChange,
  placeholder = 'Select...',
  className,
  style,
  renderOption,
  renderValue,
}: ElementOptionsSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const editor = useYooptaEditor();

  const selectedOption = options.find((opt) => opt.value === value);

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

  const handleSelect = (optionValue: T) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const defaultRenderOption = (option: SelectOption<T>) => (
    <>
      {option.icon && <span data-element-options-select-icon>{option.icon}</span>}
      {option.color && (
        <span
          data-element-options-select-color
          style={{ backgroundColor: option.color }}
        />
      )}
      <span>{option.label}</span>
    </>
  );

  const defaultRenderValue = (option: SelectOption<T> | undefined) => (
    <>
      {option?.icon && <span data-element-options-select-icon>{option.icon}</span>}
      {option?.color && (
        <span
          data-element-options-select-color
          style={{ backgroundColor: option.color }}
        />
      )}
      <span>{option?.label ?? placeholder}</span>
    </>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={className}
        style={style}
        onClick={handleTriggerClick}
        onMouseDown={handleMouseDown}
        data-element-options-select
        data-state={isOpen ? 'open' : 'closed'}
        aria-expanded={isOpen}
        aria-haspopup="listbox">
        <span data-element-options-select-value>
          {renderValue ? renderValue(selectedOption) : defaultRenderValue(selectedOption)}
        </span>
        <ChevronDown data-element-options-select-chevron />
      </button>

      {isOpen && (
        <FloatingPortal root={editor.refElement} id={`yoopta-ui-element-options-select-portal-${editor.id}`}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            data-element-options-select-content
            role="listbox"
            aria-activedescendant={value}
            tabIndex={0}>
            {options.map((option) => (
              <button
                key={String(option.value)}
                type="button"
                role="option"
                aria-selected={option.value === value}
                data-element-options-select-item
                data-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
                onMouseDown={handleMouseDown}>
                <span data-element-options-select-item-content>
                  {renderOption ? renderOption(option) : defaultRenderOption(option)}
                </span>
                {option.value === value && (
                  <Check data-element-options-select-check />
                )}
              </button>
            ))}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

ElementOptionsSelect.displayName = 'ElementOptions.Select';

