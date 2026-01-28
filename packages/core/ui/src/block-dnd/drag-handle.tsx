import type { MouseEvent as ReactMouseEvent } from 'react';
import { forwardRef, useCallback, useRef, useState } from 'react';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useSortable } from '@dnd-kit/sortable';

import { useBlockDndContext } from './block-dnd-context';
import type { DragHandleProps } from './types';

export const DragHandle = forwardRef<HTMLButtonElement, DragHandleProps>(
  ({ blockId, children, className, onClick }, ref) => {
    const { isDragging } = useBlockDndContext();
    const [isHolding, setIsHolding] = useState(false);
    const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const didDragRef = useRef(false);

    // Use sortable hook to get listeners for this specific block
    const { attributes, listeners, setActivatorNodeRef } = useSortable({
      id: blockId ?? '',
      disabled: !blockId,
    });

    // Combine refs
    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        setActivatorNodeRef(node);
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, setActivatorNodeRef],
    );

    const handleMouseDown = useCallback(
      (e: ReactMouseEvent<HTMLButtonElement>) => {
        didDragRef.current = false;
        setIsHolding(true);

        // Clear any existing timeout
        if (holdTimeoutRef.current) {
          clearTimeout(holdTimeoutRef.current);
        }

        // Trigger the sortable listeners
        const onPointerDown = (listeners as SyntheticListenerMap)?.onPointerDown;
        if (onPointerDown) {
          onPointerDown(e as unknown as PointerEvent);
        }
      },
      [listeners],
    );

    const handleMouseUp = useCallback(
      (e: ReactMouseEvent<HTMLButtonElement>) => {
        setIsHolding(false);

        if (holdTimeoutRef.current) {
          clearTimeout(holdTimeoutRef.current);
          holdTimeoutRef.current = null;
        }

        // If we didn't drag, treat as click
        if (!didDragRef.current && !isDragging) {
          onClick?.(e);
        }
      },
      [isDragging, onClick],
    );

    const combinedClassName = [
      'yoo-block-dnd-handle',
      isHolding && 'yoo-block-dnd-handle--holding',
      isDragging && 'yoo-block-dnd-handle--dragging',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    if (!blockId) {
      return (
        <button type="button" ref={ref} className={className} disabled>
          {children}
        </button>
      );
    }

    return (
      <button
        type="button"
        ref={setRefs}
        className={combinedClassName}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...attributes}
        data-block-dnd-handle
        data-block-id={blockId}
        aria-label="Drag to reorder block"
        title="Drag to reorder">
        {children}
      </button>
    );
  },
);

DragHandle.displayName = 'DragHandle';
