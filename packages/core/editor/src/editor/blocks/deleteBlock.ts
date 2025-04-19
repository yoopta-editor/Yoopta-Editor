import { YooEditor, YooptaPathIndex } from '../types';
import { YooptaOperation } from '../core/applyTransforms';
import { Paths } from '../paths';
import { getBlockSlate } from './getBlockSlate';

type DeleteBlockByIdOptions = {
  blockId: string;
  at?: never;
};

type DeleteBlockByPathOptions = {
  at: YooptaPathIndex;
  blockId?: never;
};

export type DeleteBlockOptions =
  | (DeleteBlockByIdOptions & { focus?: boolean })
  | (DeleteBlockByPathOptions & { focus?: boolean });

export function deleteBlock(editor: YooEditor, options: DeleteBlockOptions) {
  const { focus, blockId, at } = options;

  if (!blockId && typeof at !== 'number') {
    throw new Error('blockId or path should be provided');
  }

  const block = editor.getBlock({ id: blockId, at });

  if (!block) {
    throw new Error(`Block not found`);
  }

  // const isLastBlock = Object.values(editor.children).length === 1;
  // if (isLastBlock) return;

  const prevBlockPath = Paths.getPreviousPath(editor);
  const prevBlock = prevBlockPath !== null ? editor.getBlock({ at: prevBlockPath }) : undefined;
  const prevSlate = prevBlock ? getBlockSlate(editor, { id: prevBlock?.id }) : undefined;

  const blockToDelete = editor.children[block.id];
  const operations: YooptaOperation[] = [];

  const plugin = editor.plugins[blockToDelete.type];
  const { onDestroy } = plugin.events || {};
  onDestroy?.(editor, blockToDelete.id);

  operations.push({
    type: 'delete_block',
    block: blockToDelete,
    path: editor.path,
  });

  editor.applyTransforms(operations, { validatePaths: false });

  if (focus) {
    if (prevSlate && prevBlock) {
      const lastNodePoint = Paths.getLastNodePoint(prevSlate);
      editor.focusBlock(prevBlock.id, { focusAt: lastNodePoint });
    }
  }
}
