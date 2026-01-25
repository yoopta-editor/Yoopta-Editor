import { useEffect } from 'react';
import {
  type Placement,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { MoreHorizontal } from 'lucide-react';

import { useElementOptionsContext } from '../context/element-options-context';
import type { ElementOptionsTriggerProps } from '../types';

export const ElementOptionsTrigger = ({
  children,
  className,
  style,
  side,
  align,
  sideOffset = 0,
  alignOffset = 0,
}: ElementOptionsTriggerProps) => {
  const { isOpen, setIsOpen, triggerRef, anchorRef } = useElementOptionsContext();

  // Determine if we should use floating positioning
  const useFloatingPosition = Boolean(anchorRef && side);

  // Build placement string for floating-ui
  const placement: Placement = side
    ? align === 'center' || !align
      ? side
      : `${side}-${align}`
    : 'bottom';

  const { refs, floatingStyles } = useFloating({
    placement,
    middleware: [
      offset({ mainAxis: sideOffset, crossAxis: alignOffset }),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Sync anchor ref with floating-ui
  useEffect(() => {
    if (anchorRef?.current && useFloatingPosition) {
      refs.setReference(anchorRef.current);
    }
  }, [anchorRef, refs, useFloatingPosition]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Combine styles: floating styles (if using floating positioning) + custom styles
  const combinedStyles = useFloatingPosition
    ? { ...floatingStyles, ...style }
    : style;

  return (
    <button
      ref={(node) => {
        // Set both refs
        (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (useFloatingPosition) {
          refs.setFloating(node);
        }
      }}
      type="button"
      className={className}
      style={combinedStyles}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      data-element-options-trigger
      data-state={isOpen ? 'open' : 'closed'}
      aria-expanded={isOpen}
      aria-haspopup="dialog">
      {children ?? <MoreHorizontal className="yoo-element-options-trigger-icon" />}
    </button>
  );
};

ElementOptionsTrigger.displayName = 'ElementOptions.Trigger';
