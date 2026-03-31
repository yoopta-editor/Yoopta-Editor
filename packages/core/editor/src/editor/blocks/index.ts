import { buildBlockData } from './buildBlockData';
import { deleteBlock } from './deleteBlock';
import { duplicateBlock } from './duplicateBlock';
import { focusBlock } from './focusBlock';
import { getBlock } from './getBlock';
import { getBlockSlate } from './getBlockSlate';
import { insertBlock } from './insertBlock';
import { mergeBlock } from './mergeBlock';
import { moveBlock } from './moveBlock';
import { splitBlock } from './splitBlock';
import { toggleBlock } from './toggleBlock';
import { updateBlock } from './updateBlock';

export const Blocks = {
  insertBlock,
  deleteBlock,
  moveBlock,
  focusBlock,
  splitBlock,
  duplicateBlock,
  updateBlock,
  toggleBlock,
  getBlock,
  getBlockSlate,
  buildBlockData,
  mergeBlock,
};

export type Blocks = typeof Blocks;
