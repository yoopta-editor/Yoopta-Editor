import cloneDeep from 'lodash.clonedeep';

import { generateId } from '../../utils/generateId';
import type { YooptaOperation } from '../core/applyTransforms';
import type { YooEditor, YooptaBlockData, YooptaPathIndex } from '../types';
import { getBlock } from './getBlock';

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

  const originalBlock: YooptaBlockData | null = blockId
    ? editor.children[blockId]
    : getBlock(editor, { at: path! });

  if (!originalBlock) {
    throw new Error('Block not found');
  }

  const operations: YooptaOperation[] = [];

  const duplicatedBlock = cloneDeep(originalBlock);
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
