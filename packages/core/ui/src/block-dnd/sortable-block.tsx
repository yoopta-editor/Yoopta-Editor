import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useBlockDndContext } from './block-dnd-context';
import type { SortableBlockProps } from './types';

export const SortableBlock = ({ id, children, className, disabled = false, useDragHandle = false }: SortableBlockProps) => {
  const { draggedIds, isDragging, registerSortable, unregisterSortable } = useBlockDndContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging: isThisDragging,
    isOver,
  } = useSortable({
    id,
    disabled,
  });

  // Register sortable data for DragHandle
  useEffect(() => {
    if (useDragHandle) {
      registerSortable(id, {
        setActivatorNodeRef,
        listeners: listeners as Record<string, (event: any) => void>,
        attributes,
      });
      return () => {
        unregisterSortable(id);
      };
    }
  }, [id, useDragHandle, setActivatorNodeRef, listeners, attributes, registerSortable, unregisterSortable]);

  // Check if this block is part of a multi-drag
  const isPartOfMultiDrag = draggedIds.includes(id) && draggedIds.length > 1;
  const isBeingDragged = isThisDragging || (isDragging && draggedIds.includes(id));

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isBeingDragged ? 0.5 : 1,
    position: 'relative' as const,
  };

  const combinedClassName = [
    'yoopta-block-dnd-sortable',
    isThisDragging && 'yoopta-block-dnd-sortable--dragging',
    isOver && 'yoopta-block-dnd-sortable--over',
    isPartOfMultiDrag && 'yoopta-block-dnd-sortable--multi',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={combinedClassName}
      {...(!useDragHandle ? attributes : {})}
      {...(!useDragHandle ? listeners : {})}
      data-block-dnd-id={id}
      data-block-dnd-dragging={isBeingDragged || undefined}
      data-block-dnd-over={isOver || undefined}>
      {children}
      {isOver && !isThisDragging && <div className="yoopta-block-dnd-drop-indicator" />}
    </div>
  );
};
