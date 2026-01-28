import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { DragEndEvent, DragStartEvent, Modifier, UniqueIdentifier } from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Blocks } from '@yoopta/editor';
import type { YooptaBlockData } from '@yoopta/editor';

import type { BlockDndContextProps, BlockDndContextValue } from './types';
import './block-dnd.css';

const BlockDndReactContext = createContext<BlockDndContextValue | null>(null);

export const useBlockDndContext = (): BlockDndContextValue => {
  const context = useContext(BlockDndReactContext);
  if (!context) {
    throw new Error('useBlockDndContext must be used within a BlockDndContext');
  }
  return context;
};

// Custom modifier to restrict to vertical axis
const restrictToVerticalAxis: Modifier = ({ transform }) => ({
  ...transform,
  x: 0,
});

export const BlockDndContext = ({
  editor,
  children,
  onDragStart,
  onDragEnd,
  renderDragOverlay,
  enableMultiDrag = true,
}: BlockDndContextProps) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [draggedIds, setDraggedIds] = useState<UniqueIdentifier[]>([]);

  // Get sorted block IDs for SortableContext
  const blockIds = useMemo(
    () =>
      Object.keys(editor.children).sort((a, b) => {
        const aOrder = editor.children[a].meta.order;
        const bOrder = editor.children[b].meta.order;
        return aOrder - bOrder;
      }),
    [editor.children],
  );

  const activeBlock = (activeId ? editor.children[activeId as string] ?? null : null)

  // Get all dragged blocks data
  const draggedBlocks = useMemo(
    () =>
      draggedIds.map((id) => editor.children[id as string]).filter(Boolean) as YooptaBlockData[],
    [draggedIds, editor.children],
  );

  // Configure sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Small distance to distinguish click from drag
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      setActiveId(active.id);

      // Determine which blocks are being dragged
      const selectedPaths = editor.path.selected;
      let idsToMove: UniqueIdentifier[] = [active.id];

      if (enableMultiDrag && Array.isArray(selectedPaths) && selectedPaths.length > 1) {
        // Get block IDs for all selected paths
        const selectedBlockIds = selectedPaths
          .map((path) => {
            const block = Blocks.getBlock(editor, { at: path });
            return block?.id;
          })
          .filter((id): id is string => id !== undefined);

        // Only use multi-drag if the active block is part of the selection
        if (selectedBlockIds.includes(active.id as string)) {
          idsToMove = selectedBlockIds;
        }
      }

      setDraggedIds(idsToMove);

      // Callback
      const blocks = idsToMove
        .map((id) => editor.children[id as string])
        .filter(Boolean) as YooptaBlockData[];
      onDragStart?.(event, blocks);
    },
    [editor, enableMultiDrag, onDragStart],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);
      setDraggedIds([]);

      if (!over || active.id === over.id) {
        onDragEnd?.(event, false);
        return;
      }

      const currentActiveBlock = editor.children[active.id as string];
      const overBlock = editor.children[over.id as string];

      if (!currentActiveBlock || !overBlock) {
        onDragEnd?.(event, false);
        return;
      }

      const fromIndex = currentActiveBlock.meta.order;
      const toIndex = overBlock.meta.order;

      if (fromIndex === toIndex) {
        onDragEnd?.(event, false);
        return;
      }

      // Move the block(s)
      editor.batchOperations(() => {
        if (draggedIds.length > 1) {
          // Multi-block move: move all selected blocks
          // Sort by current order to maintain relative positions
          const sortedIds = [...draggedIds].sort((a, b) => {
            const aOrder = editor.children[a as string]?.meta.order ?? 0;
            const bOrder = editor.children[b as string]?.meta.order ?? 0;
            return aOrder - bOrder;
          });

          // Calculate target position
          const targetIndex = toIndex;

          // Move each block
          sortedIds.forEach((id, idx) => {
            editor.moveBlock(id as string, targetIndex + idx);
          });
        } else {
          // Single block move
          editor.moveBlock(active.id as string, toIndex);
        }
      });

      // Clear selection after move
      editor.setPath({ current: toIndex, selected: null });

      onDragEnd?.(event, true);
    },
    [editor, draggedIds, onDragEnd],
  );

  const contextValue = useMemo<BlockDndContextValue>(
    () => ({
      activeId,
      activeBlock,
      isDragging: activeId !== null,
      draggedIds,
      editor,
    }),
    [activeId, activeBlock, draggedIds, editor],
  );

  // Default drag overlay
  const defaultDragOverlay = draggedBlocks.length > 0 && (
    <div className="yoo-block-dnd-overlay">
      <div className="yoo-block-dnd-overlay-content">
        {draggedBlocks.length === 1 ? (
          <span>Moving block</span>
        ) : (
          <span>Moving {draggedBlocks.length} blocks</span>
        )}
      </div>
    </div>
  );

  return (
    <BlockDndReactContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}>
        <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
        <DragOverlay dropAnimation={null}>
          {activeId ? (renderDragOverlay ? renderDragOverlay(draggedBlocks) : defaultDragOverlay) : null}
        </DragOverlay>
      </DndContext>
    </BlockDndReactContext.Provider>
  );
};
