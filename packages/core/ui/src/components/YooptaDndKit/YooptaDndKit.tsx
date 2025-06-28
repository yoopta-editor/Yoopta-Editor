import React, { createContext, useContext, forwardRef, useCallback, useMemo, useRef } from 'react';
import {
  DndContext as DndKitContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext as DndKitSortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { cn } from '../../lib/utils';
import { YooEditor } from '@yoopta/editor';

export interface YooptaDndKitRootProps {
  children: React.ReactNode;
  id: string;
  readOnly: boolean;
  editor: YooEditor;
}

export interface YooptaDndKitItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  data?: Record<string, any>;
}

export interface YooptaDndKitOverlayProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  dropAnimation?: any;
  modifiers?: any[];
  zIndex?: number;
}

interface DragHandleContext {
  blockId: string;
  attributes: any;
  listeners: any;
  setActivatorNodeRef: (node: HTMLElement | null) => void;
}

interface YooptaDndKitContextValue {
  disabled: boolean;
  registerDragHandle: (blockId: string, dragHandle: DragHandleContext) => void;
  unregisterDragHandle: (blockId: string) => void;
  dragHandlesRef: React.MutableRefObject<Map<string, DragHandleContext>>;
}

const YooptaDndKitContext = createContext<YooptaDndKitContextValue | null>(null);

export const useYooptaDndKitContext = () => {
  const context = useContext(YooptaDndKitContext);
  if (!context) {
    throw new Error('YooptaDndKit components must be used within YooptaDndKit.Root');
  }
  return context;
};

const Root = ({ children, editor, id, readOnly }: YooptaDndKitRootProps) => {
  const dragHandlesRef = useRef<Map<string, DragHandleContext>>(new Map());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 20,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const disabled = readOnly;

  const handleDragStart = useCallback(() => {
    editor.setPath({ current: null });
  }, [editor]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active && over && active.id !== over.id) {
        const targetBlock = editor.children[over.id as string];
        if (targetBlock) {
          const newPluginPosition = targetBlock.meta.order;
          editor.moveBlock(active.id as string, newPluginPosition);
        }
      }
    },
    [editor],
  );

  const registerDragHandle = useCallback((blockId: string, dragHandle: DragHandleContext) => {
    dragHandlesRef.current.set(blockId, dragHandle);
  }, []);

  const unregisterDragHandle = useCallback((blockId: string) => {
    dragHandlesRef.current.delete(blockId);
  }, []);

  const contextValue: YooptaDndKitContextValue = useMemo(
    () => ({
      disabled,
      registerDragHandle,
      unregisterDragHandle,
      dragHandlesRef,
    }),
    [disabled, registerDragHandle, unregisterDragHandle, dragHandlesRef],
  );

  const items = useMemo(() => {
    const childrenKeys = Object.keys(editor.children);
    if (childrenKeys.length === 0) return [];

    // Сортируем блоки по их реальному порядку в редакторе
    return childrenKeys.sort((a, b) => {
      const aOrder = editor.children[a].meta.order;
      const bOrder = editor.children[b].meta.order;
      return aOrder - bOrder;
    });
  }, [editor.children]);

  return (
    <YooptaDndKitContext.Provider value={contextValue}>
      <DndKitContext
        id={id || `dnd-${editor.id}`}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <DndKitSortableContext items={items} strategy={verticalListSortingStrategy} disabled={disabled}>
          {children}
        </DndKitSortableContext>
      </DndKitContext>
    </YooptaDndKitContext.Provider>
  );
};

Root.displayName = 'YooptaDndKit.Root';

export const useBlockStyles = (
  transform: Record<string, number> | null,
  transition: string | undefined,
  isDragging: boolean,
  isOver: boolean,
) => {
  return useMemo(
    () => ({
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
      transition,
      opacity: isDragging ? 0.7 : 1,
      borderBottom: isOver && !isDragging ? '2px solid #007aff' : undefined,
    }),
    [transform, transition, isDragging, isOver],
  );
};

const Item = forwardRef<HTMLDivElement, YooptaDndKitItemProps>(
  ({ id, children, className, style, data, ...props }, ref) => {
    const { registerDragHandle, unregisterDragHandle, disabled } = useYooptaDndKitContext();

    const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition, isDragging, isOver } =
      useSortable({ id });

    const blockStyles = useBlockStyles(transform, transition, isDragging, isOver);

    React.useEffect(() => {
      if (!disabled) {
        registerDragHandle(id, {
          blockId: id,
          attributes,
          listeners,
          setActivatorNodeRef,
        });
      }

      return () => {
        unregisterDragHandle(id);
      };
    }, [id, attributes, listeners, setActivatorNodeRef, registerDragHandle, unregisterDragHandle, disabled]);

    return (
      <div
        data-block-id={id}
        ref={setNodeRef}
        className={className}
        style={blockStyles}
        data-dragging={isDragging}
        data-over={isOver}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Item.displayName = 'YooptaDndKit.Item';

// Overlay component
const Overlay = ({
  children,
  className,
  style,
  dropAnimation,
  modifiers,
  zIndex = 999,
  ...props
}: YooptaDndKitOverlayProps) => {
  return (
    <DragOverlay
      className={cn('yoo-drag-overlay', className)}
      style={{ zIndex, ...style }}
      dropAnimation={dropAnimation}
      modifiers={modifiers}
      {...props}
    >
      {children}
    </DragOverlay>
  );
};

Overlay.displayName = 'YooptaDndKit.Overlay';

// Main component with subcomponents
const YooptaDndKit = Object.assign(Root, {
  Root,
  Item,
  Overlay,
});

export { YooptaDndKit };
