import * as Popover from '@radix-ui/react-popover';
import { MoreHorizontal } from 'lucide-react';

import { useElementOptionsContext } from '../context/element-options-context';
import type { ElementOptionsTriggerProps } from '../types';

export const ElementOptionsTrigger = ({
  children,
  className,
  style,
}: ElementOptionsTriggerProps) => {
  const { isOpen } = useElementOptionsContext();

  return (
    <Popover.Trigger asChild>
      <button
        type="button"
        className={className}
        style={style}
        onMouseDown={(e) => e.preventDefault()}
        data-element-options-trigger
        data-state={isOpen ? 'open' : 'closed'}
        aria-haspopup="dialog">
        {children ?? <MoreHorizontal className="yoopta-ui-element-options-trigger-icon" />}
      </button>
    </Popover.Trigger>
  );
};

ElementOptionsTrigger.displayName = 'ElementOptions.Trigger';
