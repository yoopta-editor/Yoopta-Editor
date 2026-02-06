import * as Select from '@radix-ui/react-select';
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
  const editor = useYooptaEditor();
  const selectedOption = options.find((opt) => opt.value === value);

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
    <Select.Root value={value} onValueChange={(v) => onValueChange(v as T)}>
      <Select.Trigger
        className={className}
        style={style}
        data-element-options-select
        onMouseDown={(e) => e.preventDefault()}>
        <Select.Value placeholder={placeholder}>
          <span data-element-options-select-value>
            {renderValue ? renderValue(selectedOption) : defaultRenderValue(selectedOption)}
          </span>
        </Select.Value>
        <Select.Icon>
          <ChevronDown data-element-options-select-chevron />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal container={editor.refElement}>
        <Select.Content
          data-element-options-select-content
          position="popper"
          sideOffset={4}
          onCloseAutoFocus={(e) => e.preventDefault()}>
          <Select.Viewport>
            {options.map((option) => (
              <Select.Item
                key={String(option.value)}
                value={String(option.value)}
                data-element-options-select-item
                data-selected={option.value === value}>
                <Select.ItemText>
                  <span data-element-options-select-item-content>
                    {renderOption ? renderOption(option) : defaultRenderOption(option)}
                  </span>
                </Select.ItemText>
                <Select.ItemIndicator>
                  <Check data-element-options-select-check />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

ElementOptionsSelect.displayName = 'ElementOptions.Select';
