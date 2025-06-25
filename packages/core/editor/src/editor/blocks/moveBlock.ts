import { MoveBlockOperation, YooptaOperation } from '../core/applyTransforms';
import { YooEditor, YooptaPathIndex } from '../types';

export function moveBlock(editor: YooEditor, draggedBlockId: string, newPath: YooptaPathIndex) {
  const draggedBlock = editor.children[draggedBlockId];
  const blockInNewPosition = Object.values(editor.children).find((item) => item.meta.order === newPath);

  if (!draggedBlock || !blockInNewPosition || newPath === null) {
    console.warn('Invalid block ids for move operation');
    return;
  }

  const oldOrder = draggedBlock.meta.order;
  const newOrder = newPath;

  if (oldOrder === newOrder) {
    return;
  }

  const operations: YooptaOperation[] = [];

  const moveOperation: MoveBlockOperation = {
    type: 'move_block',
    prevProperties: {
      id: draggedBlockId,
      order: oldOrder,
    },
    properties: {
      id: draggedBlockId,
      order: newOrder,
    },
  };

  operations.push(moveOperation);

  editor.applyTransforms(operations);
  editor.setPath({ current: newOrder });
}
