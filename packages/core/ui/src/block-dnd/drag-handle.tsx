import type { MouseEvent as ReactMouseEvent } from 'react';
import { cloneElement, forwardRef, isValidElement, useCallback, useEffect, useRef, useState } from 'react';

import { useBlockDndContext } from './block-dnd-context';
import type { DragHandleProps } from './types';

export const DragHandle = forwardRef<HTMLButtonElement, DragHandleProps>(
  ({ blockId, children, className, onClick, asChild = false }, ref) => {
    const { isDragging, getSortable } = useBlockDndContext();
    const [isHolding, setIsHolding] = useState(false);
    const didDragRef = useRef(false);

    // Get sortable data for this block
    const sortableData = blockId ? getSortable(blockId) : null;

    // Store ref in a mutable ref to avoid assignment issues
    const refCallback = useRef<typeof ref>(ref);
    refCallback.current = ref;

    // Combine refs
    const setRefs = useCallback(
      (node: HTMLElement | null) => {
        if (sortableData) {
          sortableData.setActivatorNodeRef(node as HTMLButtonElement | null);
        }
        const currentRef = refCallback.current;
        if (typeof currentRef === 'function') {
          currentRef(node as HTMLButtonElement);
        } else if (currentRef) {
          // eslint-disable-next-line no-param-reassign
          (currentRef as React.MutableRefObject<HTMLButtonElement | null>).current = node as HTMLButtonElement;
        }
      },
      [sortableData],
    );

    // Track if drag actually happened
    useEffect(() => {
      if (isDragging) {
        didDragRef.current = true;
        setIsHolding(true);
      } else {
        // Reset after drag ends
        const timer = setTimeout(() => {
          didDragRef.current = false;
          setIsHolding(false);
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [isDragging]);

    const handleClick = useCallback(
      (e: ReactMouseEvent<HTMLElement>) => {
        // Only call onClick if we didn't drag
        if (!didDragRef.current && !isDragging) {
          onClick?.(e as unknown as MouseEvent);
        }
      },
      [isDragging, onClick],
    );

    const combinedClassName = [
      'yoopta-ui-block-dnd-handle',
      isHolding && 'yoopta-ui-block-dnd-handle--holding',
      isDragging && 'yoopta-ui-block-dnd-handle--dragging',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // If no sortable data or no blockId (not inside SortableBlock with useDragHandle), return disabled button
    if (!sortableData || !blockId) {
      if (asChild && isValidElement(children)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const childProps = children.props as any;
        const childRef = childProps.ref;

        // Combine refs: our ref + child's ref
        const combinedRef = (node: HTMLElement | null) => {
          // Call our ref
          if (typeof ref === 'function') {
            ref(node as HTMLButtonElement);
          } else if (ref) {
            // eslint-disable-next-line no-param-reassign
            (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node as HTMLButtonElement;
          }
          // Call child's ref if it exists
          if (childRef) {
            if (typeof childRef === 'function') {
              childRef(node);
            } else if (childRef && 'current' in childRef) {
              // eslint-disable-next-line no-param-reassign
              (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
            }
          }
        };

        return cloneElement(children, {
          ...childProps,
          ref: combinedRef,
          className,
          disabled: true,
        });
      }
      return (
        <button type="button" ref={ref} className={className} disabled>
          {children}
        </button>
      );
    }

    // If asChild is true, merge props with child element
    if (asChild && isValidElement(children)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const childProps = children.props as any;
      const childRef = childProps.ref;

      // Combine refs: setActivatorNodeRef + our ref + child's ref
      const combinedRef = (node: HTMLElement | null) => {
        // Set activator node ref for dnd-kit
        if (sortableData) {
          sortableData.setActivatorNodeRef(node as HTMLButtonElement | null);
        }
        
        // Call our ref (from forwardRef)
        const currentRef = refCallback.current;
        if (typeof currentRef === 'function') {
          currentRef(node as HTMLButtonElement);
        } else if (currentRef) {
          // eslint-disable-next-line no-param-reassign
          (currentRef as React.MutableRefObject<HTMLButtonElement | null>).current = node as HTMLButtonElement;
        }
        
        // Call child's ref if it exists (important for dragHandleRef in FloatingBlockActions)
        if (childRef) {
          if (typeof childRef === 'function') {
            childRef(node);
          } else if (childRef && 'current' in childRef) {
            // eslint-disable-next-line no-param-reassign
            (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
          }
        }
      };

      return cloneElement(children, {
        ...childProps,
        ref: combinedRef,
        className: [combinedClassName, childProps.className].filter(Boolean).join(' '),
        onClick: (e: ReactMouseEvent<HTMLElement>) => {
          handleClick(e);
          childProps.onClick?.(e);
        },
        ...sortableData.attributes,
        ...sortableData.listeners,
        'data-block-dnd-handle': true,
        'data-block-id': blockId,
        'aria-label': childProps['aria-label'] || 'Drag to reorder block',
        title: childProps.title || 'Drag to reorder',
      });
    }

    return (
      <button
        type="button"
        ref={setRefs}
        className={combinedClassName}
        onClick={handleClick}
        {...sortableData.attributes}
        {...sortableData.listeners}
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
