import type { SlateEditor } from '@yoopta/editor';
import type { NodeEntry } from 'slate';

import type { TableCellElement } from '../types';

export type SlateNodeEntry = NodeEntry<TableCellElement>;

export const TABLE_CELLS_IN_SELECTION = new WeakMap<SlateEditor, SlateNodeEntry[]>();
export const TABLE_SLATE_TO_SELECTION_SET = new WeakMap<SlateEditor, WeakSet<TableCellElement>>();
