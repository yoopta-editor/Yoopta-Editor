import { useEffect, useRef } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  type Placement,
} from '@floating-ui/react';

import { Portal } from '../../portal';
import { useElementOptionsContext } from '../context/element-options-context';
import type { ElementOptionsContentProps } from '../types';

export const ElementOptionsContent = ({
  children,
  className,
  style,
  side = 'bottom',
  align = 'end',
  sideOffset = 4,
  alignOffset = 0,
}: ElementOptionsContentProps) => {
  const { isOpen, setIsOpen, triggerRef, contentRef } = useElementOptionsContext();
  const internalContentRef = useRef<HTMLDivElement>(null);

  // Build placement string for floating-ui
  const placement: Placement = align === 'center' ? side : `${side}-${align}`;

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement,
    middleware: [
      offset({ mainAxis: sideOffset, crossAxis: alignOffset }),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Sync trigger ref with floating-ui
  useEffect(() => {
    if (triggerRef.current) {
      refs.setReference(triggerRef.current);
    }
  }, [triggerRef, refs]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const triggerEl = triggerRef.current;
      const contentEl = internalContentRef.current;

      if (
        triggerEl &&
        !triggerEl.contains(target) &&
        contentEl &&
        !contentEl.contains(target)
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
  }, [isOpen, setIsOpen, triggerRef]);

  if (!isOpen) return null;

  return (
    <Portal id="element-options-portal">
      <div
        ref={(node) => {
          refs.setFloating(node);
          internalContentRef.current = node;
          if (contentRef) {
            (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        className={className}
        style={{ ...floatingStyles, ...style }}
        data-element-options-content
        data-state="open"
        data-side={side}
        data-align={align}
        role="dialog"
        aria-modal="true">
        {children}
      </div>
    </Portal>
  );
};

ElementOptionsContent.displayName = 'ElementOptions.Content';

