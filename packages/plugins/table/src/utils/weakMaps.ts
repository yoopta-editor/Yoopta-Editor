import type { SlateEditor} from '@yoopta/editor';
import { SlateElement } from '@yoopta/editor';
import type { NodeEntry } from 'slate';

import type { TableCellElement} from '../types';
import { TableRowElement } from '../types';

export type SlateNodeEntry = NodeEntry<TableCellElement>;

export const EDITOR_TO_SELECTION = new WeakMap<SlateEditor, SlateNodeEntry[]>();
export const TABLE_SLATE_TO_SELECTION_SET = new WeakMap<SlateEditor, WeakSet<TableCellElement>>();
