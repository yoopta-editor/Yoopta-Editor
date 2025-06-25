import { useState, useCallback } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  UniqueIdentifier,
  DragOverlay,
  defaultDropAnimationSideEffects,
  PointerActivationConstraint,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export interface UseYooptaDndKitProps {
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  activationConstraint?: PointerActivationConstraint;
  collisionDetection?: any;
  measuring?: any;
  modifiers?: any[];
}

export interface UseYooptaDndKitReturn {
  sensors: ReturnType<typeof useSensors>;
  activeId: UniqueIdentifier | null;
  isDragging: boolean;
  dragOverlay: {
    DragOverlayComponent: typeof DragOverlay;
    dropAnimation: any;
  };
  handlers: {
    handleDragStart: (event: DragStartEvent) => void;
    handleDragEnd: (event: DragEndEvent) => void;
    handleDragOver: (event: DragOverEvent) => void;
  };
}

export function useYooptaDndKit({
  onDragStart,
  onDragEnd,
  onDragOver,
  activationConstraint = { distance: 8 },
  collisionDetection,
  measuring,
  modifiers,
}: UseYooptaDndKitProps = {}): UseYooptaDndKitReturn {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id);
      setIsDragging(true);
      onDragStart?.(event);
    },
    [onDragStart],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      setIsDragging(false);
      onDragEnd?.(event);
    },
    [onDragEnd],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      onDragOver?.(event);
    },
    [onDragOver],
  );

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return {
    sensors,
    activeId,
    isDragging,
    dragOverlay: {
      DragOverlayComponent: DragOverlay,
      dropAnimation,
    },
    handlers: {
      handleDragStart,
      handleDragEnd,
      handleDragOver,
    },
  };
}
