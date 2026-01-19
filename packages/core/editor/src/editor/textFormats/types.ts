import type { Range } from 'slate';

import type { YooptaPathIndex } from '../types';

/**
 * Options for getting mark value
 */
export type GetMarkValueOptions = {
  /**
   * Block index (order) to get mark from
   * If not provided, uses current selection path
   */
  at?: YooptaPathIndex;
  /**
   * Block ID to get mark from
   */
  blockId?: string;
  /**
   * Mark type to get value for
   */
  type: string;
};

/**
 * Options for checking if mark is active
 */
export type IsMarkActiveOptions = {
  /**
   * Block index (order) to check mark in
   * If not provided, uses current selection path
   */
  at?: YooptaPathIndex;
  /**
   * Block ID to check mark in
   */
  blockId?: string;
  /**
   * Mark type to check
   */
  type: string;
};

/**
 * Options for toggling a mark
 */
export type ToggleMarkOptions = {
  /**
   * Block index (order) or array of indices to toggle mark in
   * If not provided and selection is not specified, uses current text selection (slate.selection) or block selection
   */
  at?: YooptaPathIndex | YooptaPathIndex[];
  /**
   * Block ID or array of IDs to toggle mark in
   */
  blockId?: string | string[];
  /**
   * Mark type to toggle
   */
  type: string;
  /**
   * Specific text selection (Range) to apply mark to
   * If not provided, uses slate.selection from current block
   * If provided, works with this selection instead of whole blocks
   */
  selection?: Range;
};

/**
 * Options for updating a mark
 */
export type UpdateMarkOptions = {
  /**
   * Block index (order) or array of indices to update mark in
   * If not provided and selection is not specified, uses current text selection (slate.selection) or block selection
   */
  at?: YooptaPathIndex | YooptaPathIndex[];
  /**
   * Block ID or array of IDs to update mark in
   */
  blockId?: string | string[];
  /**
   * Mark type to update
   */
  type: string;
  /**
   * Value to set for the mark
   */
  value: unknown;
  /**
   * Specific text selection (Range) to apply mark to
   * If not provided, uses slate.selection from current block
   * If provided, works with this selection instead of whole blocks
   */
  selection?: Range;
};

/**
 * Options for adding a mark
 */
export type AddMarkOptions = {
  /**
   * Block index (order) or array of indices to add mark to
   * If not provided and selection is not specified, uses current text selection (slate.selection) or block selection
   */
  at?: YooptaPathIndex | YooptaPathIndex[];
  /**
   * Block ID or array of IDs to add mark to
   */
  blockId?: string | string[];
  /**
   * Mark type to add
   */
  type: string;
  /**
   * Value to set for the mark
   */
  value: unknown;
  /**
   * Specific text selection (Range) to apply mark to
   * If not provided, uses slate.selection from current block
   * If provided, works with this selection instead of whole blocks
   */
  selection?: Range;
};

/**
 * Options for removing a mark
 */
export type RemoveMarkOptions = {
  /**
   * Block index (order) or array of indices to remove mark from
   * If not provided and selection is not specified, uses current text selection (slate.selection) or block selection
   */
  at?: YooptaPathIndex | YooptaPathIndex[];
  /**
   * Block ID or array of IDs to remove mark from
   */
  blockId?: string | string[];
  /**
   * Mark type to remove
   */
  type: string;
  /**
   * Specific text selection (Range) to remove mark from
   * If not provided, uses slate.selection from current block
   * If provided, works with this selection instead of whole blocks
   */
  selection?: Range;
};

/**
 * Options for getting all marks
 */
export type GetMarksOptions = {
  /**
   * Block index (order) to get marks from
   * If not provided, uses current selection path
   */
  at?: YooptaPathIndex;
  /**
   * Block ID to get marks from
   */
  blockId?: string;
};

/**
 * Options for clearing all marks
 */
export type ClearMarksOptions = {
  /**
   * Block index (order) or array of indices to clear marks in
   * If not provided and selection is not specified, uses current text selection (slate.selection) or block selection
   */
  at?: YooptaPathIndex | YooptaPathIndex[];
  /**
   * Block ID or array of IDs to clear marks in
   */
  blockId?: string | string[];
  /**
   * Specific text selection (Range) to clear marks from
   * If not provided, uses slate.selection from current block
   * If provided, works with this selection instead of whole blocks
   */
  selection?: Range;
};

