import type { Point, Range, Selection } from 'slate';

import type { YooptaPathIndex } from '../types';

/**
 * Options for getting current block order
 */
export type GetCurrentOptions = {
  /**
   * Block index (order) to get
   * If not provided, returns editor.path.current
   */
  at?: YooptaPathIndex;
};

/**
 * Options for setting current block order
 */
export type SetCurrentOptions = {
  /**
   * Block index (order) to set as current
   */
  at: YooptaPathIndex;
  /**
   * Source of the path change
   */
  source?: 'selection-box' | 'native-selection' | 'mousemove' | 'keyboard' | 'copy-paste';
};

/**
 * Options for getting selected block orders
 */
export type GetSelectedOptions = {
  /**
   * Block index (order) to check if selected
   * If not provided, returns all selected block orders
   */
  at?: YooptaPathIndex;
};

/**
 * Options for setting selected block orders
 */
export type SetSelectedOptions = {
  /**
   * Block index (order) or array of orders to select
   */
  at: YooptaPathIndex | YooptaPathIndex[];
  /**
   * Source of the selection change
   */
  source?: 'selection-box' | 'native-selection' | 'mousemove' | 'keyboard' | 'copy-paste';
};

/**
 * Options for checking if block is selected
 */
export type IsBlockSelectedOptions = {
  /**
   * Block index (order) to check
   */
  at: YooptaPathIndex;
};

/**
 * Options for getting Slate selection
 */
export type GetSlateSelectionOptions = {
  /**
   * Block index (order) to get selection from
   * If not provided, uses current block
   */
  at?: YooptaPathIndex;
  /**
   * Block ID to get selection from
   */
  blockId?: string;
};

/**
 * Options for setting Slate selection
 */
export type SetSlateSelectionOptions = {
  /**
   * Selection (Range) to set
   */
  selection: Range;
  /**
   * Block index (order) to set selection in
   * If not provided, uses current block
   */
  at?: YooptaPathIndex;
  /**
   * Block ID to set selection in
   */
  blockId?: string;
};

/**
 * Options for getting range from selection
 */
export type GetRangeOptions = {
  /**
   * Block index (order) to get range from
   * If not provided, uses current block
   */
  at?: YooptaPathIndex;
  /**
   * Block ID to get range from
   */
  blockId?: string;
};

/**
 * Options for getting point (anchor, focus, start, end)
 */
export type GetPointOptions = {
  /**
   * Block index (order) to get point from
   * If not provided, uses current block
   */
  at?: YooptaPathIndex;
  /**
   * Block ID to get point from
   */
  blockId?: string;
};

/**
 * Options for getting next/previous block order
 */
export type GetNextBlockOptions = {
  /**
   * Block index (order) to get next/previous from
   * If not provided, uses current block
   */
  at?: YooptaPathIndex;
};

