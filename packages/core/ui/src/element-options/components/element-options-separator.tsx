import type { ElementOptionsSeparatorProps } from '../types';

export const ElementOptionsSeparator = ({
  className,
  style,
}: ElementOptionsSeparatorProps) => (
  <div
    className={className}
    style={style}
    data-element-options-separator
    role="separator"
    aria-orientation="horizontal"
  />
);

ElementOptionsSeparator.displayName = 'ElementOptions.Separator';

