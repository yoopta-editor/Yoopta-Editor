import { useCallback, useMemo } from 'react';
import { Blocks } from '@yoopta/editor';
import type { YooEditor } from '@yoopta/editor';

import { useBlockDndContext } from './block-dnd-context';

export type UseBlockDndOptions = {
  blockId?: string | null;
};

export type UseBlockDndReturn = {
  /** Whether any block is being dragged */
  isDragging: boolean;
  /** Whether this specific block is being dragged */
  isBlockDragging: boolean;
  /** Whether this block is part of a multi-drag selection */
  isPartOfMultiDrag: boolean;
  /** Number of blocks being dragged */
  dragCount: number;
  /** IDs of blocks being dragged */
  draggedIds: string[];
  /** Move a block to a new position */
  moveBlock: (blockId: string, toIndex: number) => void;
  /** Move multiple blocks to a new position */
  moveBlocks: (blockIds: string[], toIndex: number) => void;
};

/**
 * Hook to access block DnD state and actions
 */
export const useBlockDnd = (options: UseBlockDndOptions = {}): UseBlockDndReturn => {
  const { blockId } = options;
  const context = useBlockDndContext();
  const { isDragging, draggedIds, editor } = context;

  const isBlockDragging = useMemo(() => {
    if (!blockId) return false;
    return draggedIds.includes(blockId);
  }, [blockId, draggedIds]);

  const isPartOfMultiDrag = useMemo(() => {
    if (!blockId) return false;
    return draggedIds.includes(blockId) && draggedIds.length > 1;
  }, [blockId, draggedIds]);

  const moveBlock = useCallback(
    (id: string, toIndex: number) => {
      editor.moveBlock(id, toIndex);
    },
    [editor],
  );

  const moveBlocks = useCallback(
    (ids: string[], toIndex: number) => {
      editor.batchOperations(() => {
        // Sort by current order to maintain relative positions
        const sortedIds = [...ids].sort((a, b) => {
          const aOrder = editor.children[a]?.meta.order ?? 0;
          const bOrder = editor.children[b]?.meta.order ?? 0;
          return aOrder - bOrder;
        });

        sortedIds.forEach((id, idx) => {
          editor.moveBlock(id, toIndex + idx);
        });
      });
    },
    [editor],
  );

  return {
    isDragging,
    isBlockDragging,
    isPartOfMultiDrag,
    dragCount: draggedIds.length,
    draggedIds: draggedIds as string[],
    moveBlock,
    moveBlocks,
  };
};

/**
 * Get sorted block IDs from the editor
 */
export const getOrderedBlockIds = (editor: YooEditor): string[] => {
  return Object.keys(editor.children).sort((a, b) => {
    const aOrder = editor.children[a].meta.order;
    const bOrder = editor.children[b].meta.order;
    return aOrder - bOrder;
  });
};
