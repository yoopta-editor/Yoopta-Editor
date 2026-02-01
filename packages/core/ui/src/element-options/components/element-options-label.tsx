import type { ElementOptionsLabelProps } from '../types';

export const ElementOptionsLabel = ({
  children,
  className,
  style,
}: ElementOptionsLabelProps) => (
  <label className={className} style={style} data-element-options-label>
    {children}
  </label>
);

ElementOptionsLabel.displayName = 'ElementOptions.Label';

