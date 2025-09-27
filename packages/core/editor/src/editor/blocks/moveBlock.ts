import { MoveBlockOperation, YooptaOperation } from '../core/applyTransforms';
import { YooEditor, YooptaPathIndex } from '../types';

export function moveBlock(editor: YooEditor, draggedBlockId: string, newPath: YooptaPathIndex) {
  const updatedPosition = newPath;
  const draggedBlock = editor.children[draggedBlockId];
  const blockInNewPosition = Object.values(editor.children).find(
    (item) => item.meta.order === updatedPosition,
  );

  if (!draggedBlock || !blockInNewPosition) {
    console.warn('Invalid block ids for move operation');
    return;
  }
  const operations: YooptaOperation[] = [];

  const moveOperation: MoveBlockOperation = {
    type: 'move_block',
    prevProperties: {
      id: draggedBlockId,
      order: draggedBlock.meta.order,
    },
    properties: {
      id: draggedBlockId,
      order: updatedPosition!,
    },
  };

  operations.push(moveOperation);

  editor.applyTransforms(operations);
  editor.setPath({ current: updatedPosition });
}
