import type { ReactNode } from 'react';
import type { DragEndEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import type { YooEditor, YooptaBlockData } from '@yoopta/editor';

export type BlockDndContextValue = {
  /** Currently dragging block ID */
  activeId: UniqueIdentifier | null;
  /** Currently dragging block data */
  activeBlock: YooptaBlockData | null;
  /** Whether drag is in progress */
  isDragging: boolean;
  /** IDs of blocks being dragged (for multi-select) */
  draggedIds: UniqueIdentifier[];
  /** The editor instance */
  editor: YooEditor;
};

export type BlockDndContextProps = {
  /** The Yoopta editor instance */
  editor: YooEditor;
  /** Children to render */
  children: ReactNode;
  /** Called when drag starts */
  onDragStart?: (event: DragStartEvent, blocks: YooptaBlockData[]) => void;
  /** Called when drag ends */
  onDragEnd?: (event: DragEndEvent, moved: boolean) => void;
  /** Custom drag overlay render */
  renderDragOverlay?: (blocks: YooptaBlockData[]) => ReactNode;
  /** Enable multi-block drag when blocks are selected */
  enableMultiDrag?: boolean;
};

export type SortableBlockProps = {
  /** Unique block ID */
  id: string;
  /** Block index in the list */
  index?: number;
  /** Children to render */
  children: ReactNode;
  /** Additional class name */
  className?: string;
  /** Whether this block is disabled for dragging */
  disabled?: boolean;
};

export type DragHandleProps = {
  /** Block ID this handle controls */
  blockId: string | null;
  /** Children (usually an icon) */
  children: ReactNode;
  /** Additional class name */
  className?: string;
  /** Called when drag handle is clicked (not dragged) */
  onClick?: (e: MouseEvent) => void;
};

export type DropIndicatorProps = {
  /** Whether to show the indicator */
  isVisible: boolean;
  /** Position: 'before' or 'after' the target block */
  position?: 'before' | 'after';
  /** Additional class name */
  className?: string;
};
