import * as Switch from '@radix-ui/react-switch';

import type { ElementOptionsToggleProps } from '../types';

export const ElementOptionsToggle = ({
  checked,
  onCheckedChange,
  label,
  className,
  style,
}: ElementOptionsToggleProps) => {
  return (
    <div className={className} style={style} data-element-options-toggle-wrapper>
      <Switch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        onMouseDown={(e) => e.preventDefault()}
        data-element-options-toggle>
        <Switch.Thumb data-element-options-toggle-thumb />
      </Switch.Root>
      {label && <span data-element-options-toggle-label>{label}</span>}
    </div>
  );
};

ElementOptionsToggle.displayName = 'ElementOptions.Toggle';
