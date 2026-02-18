import { addToColumn } from './addToColumn';
import { createColumnGroup } from './createColumnGroup';
import { deleteColumnGroup } from './deleteColumnGroup';
import { getColumnGroupBlocks } from './getColumnGroupBlocks';
import { removeFromColumn } from './removeFromColumn';
import { setColumnWidth } from './setColumnWidth';

export const Columns = {
  createColumnGroup,
  addToColumn,
  removeFromColumn,
  setColumnWidth,
  deleteColumnGroup,
  getColumnGroupBlocks,
};

export type { CreateColumnGroupOptions } from './createColumnGroup';
export type { AddToColumnOptions } from './addToColumn';
export type { RemoveFromColumnOptions } from './removeFromColumn';
export type { SetColumnWidthOptions } from './setColumnWidth';
export type { DeleteColumnGroupOptions } from './deleteColumnGroup';
