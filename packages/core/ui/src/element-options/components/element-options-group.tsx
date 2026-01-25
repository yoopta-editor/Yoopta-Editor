import type { ElementOptionsGroupProps } from '../types';

export const ElementOptionsGroup = ({
  children,
  className,
  style,
}: ElementOptionsGroupProps) => (
  <div className={className} style={style} data-element-options-group>
    {children}
  </div>
);

ElementOptionsGroup.displayName = 'ElementOptions.Group';

