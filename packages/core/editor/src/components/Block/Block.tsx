import React, { memo } from 'react';
import { useYooptaEditor } from '../../contexts/YooptaContext/YooptaContext';
import { useSortable } from '@dnd-kit/sortable';
import { YooptaBlockData } from '../../editor/types';
import { useBlockStyles } from './hooks';
import { Paths } from '../../editor/paths';

type BlockProps = {
  children: React.ReactNode;
  block: YooptaBlockData;
  blockId: string;
  onActiveDragHandleChange: (props: any) => void;
};

const Block = memo(({ children, block, blockId, onActiveDragHandleChange }: BlockProps) => {
  const editor = useYooptaEditor();

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isOver,
    isDragging,
  } = useSortable({ id: blockId, disabled: editor.readOnly });
  const blockStyles = useBlockStyles(block, transform, transition, isDragging, isOver);

  const align = block.meta.align || 'left';
  const className = `yoopta-block yoopta-align-${align}`;

  const isSelected = Paths.isBlockSelected(editor, block);

  const handleMouseEnter = () => {
    if (!editor.readOnly && onActiveDragHandleChange) {
      onActiveDragHandleChange({
        attributes,
        listeners,
        setActivatorNodeRef,
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={className}
      style={blockStyles}
      data-yoopta-block
      data-yoopta-block-id={blockId}
      onMouseEnter={handleMouseEnter}>
      {children}
      {!editor.readOnly && (
        <div data-block-selected={isSelected} className="yoopta-selection-block" />
      )}
    </div>
  );
});

Block.displayName = 'Block';

export { Block };
