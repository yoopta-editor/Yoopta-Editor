import { deepClone } from '../../utils/deepClone';
import { findPluginBlockByPath } from '../../utils/findPluginBlockByPath';
import { generateId } from '../../utils/generateId';
import { YooptaOperation } from '../core/applyTransforms';
import { YooEditor, YooptaBlock, YooptaBlockData, YooptaPathIndex } from '../types';

export type DuplicateBlockOptions = {
  original: { blockId?: never; path: YooptaPathIndex } | { blockId: string; path?: never };
  focus?: boolean;
  at?: YooptaPathIndex;
};

export function duplicateBlock(editor: YooEditor, options: DuplicateBlockOptions) {
  const { original, focus, at } = options;

  if (!original) {
    throw new Error('`original` should be provided');
  }

  if (!original.blockId && typeof original.path !== 'number') {
    throw new Error('blockId or path should be provided');
  }

  const { blockId, path } = original;

  let originalBlock: YooptaBlockData | null = blockId
    ? editor.children[blockId]
    : findPluginBlockByPath(editor, { at: path! });

  if (!originalBlock) {
    throw new Error('Block not found');
  }

  const operations: YooptaOperation[] = [];

  const duplicatedBlock = deepClone(originalBlock);
  duplicatedBlock.id = generateId();
  // [TEST]
  duplicatedBlock.meta.order =
    Array.isArray(at) && typeof at === 'number' ? at : originalBlock.meta.order + 1;

  operations.push({
    type: 'insert_block',
    path: { current: duplicatedBlock.meta.order },
    block: duplicatedBlock,
  });

  editor.applyTransforms(operations);

  if (focus) {
    editor.focusBlock(duplicatedBlock.id, { waitExecution: true });
  }

  return duplicatedBlock.id;
}
