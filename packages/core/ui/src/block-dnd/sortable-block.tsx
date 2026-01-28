import type { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useBlockDndContext } from './block-dnd-context';
import type { SortableBlockProps } from './types';

export const SortableBlock = ({ id, children, className, disabled = false }: SortableBlockProps) => {
  const { draggedIds, isDragging } = useBlockDndContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isThisDragging,
    isOver,
  } = useSortable({
    id,
    disabled,
  });

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
    'yoo-block-dnd-sortable',
    isThisDragging && 'yoo-block-dnd-sortable--dragging',
    isOver && 'yoo-block-dnd-sortable--over',
    isPartOfMultiDrag && 'yoo-block-dnd-sortable--multi',
    className,
  ]
    .filter(Boolean)
    .join(' ');


  return (
    <div
      ref={setNodeRef}
      style={style}
      className={combinedClassName}
      {...attributes}
      {...listeners}
      data-block-dnd-id={id}
      data-block-dnd-dragging={isBeingDragged || undefined}
      data-block-dnd-over={isOver || undefined}>
      {children}

      {isOver && !isThisDragging && <div className="yoo-block-dnd-drop-indicator" />}
    </div>
  );
};
