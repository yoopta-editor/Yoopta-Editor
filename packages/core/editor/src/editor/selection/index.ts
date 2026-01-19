import { getAnchor } from './getAnchor';
import { getCurrent } from './getCurrent';
import { getEnd } from './getEnd';
import { getFirstPoint } from './getFirstPoint';
import { getFocus } from './getFocus';
import { getLastPoint } from './getLastPoint';
import { getNext } from './getNext';
import { getPrevious } from './getPrevious';
import { getRange } from './getRange';
import { getSelected } from './getSelected';
import { getSlateSelection } from './getSlateSelection';
import { getStart } from './getStart';
import { isBlockSelected } from './isBlockSelected';
import { isCollapsed } from './isCollapsed';
import { isEmpty } from './isEmpty';
import { isExpanded } from './isExpanded';
import { setCurrent } from './setCurrent';
import { setSelected } from './setSelected';
import { setSlateSelection } from './setSlateSelection';

// Namespace export
export const Selection = {
  // Block-level operations
  getCurrent,
  setCurrent,
  getSelected,
  setSelected,
  isBlockSelected,
  isEmpty,
  getNext,
  getPrevious,

  // Slate selection operations
  getSlateSelection,
  setSlateSelection,
  getRange,
  isExpanded,
  isCollapsed,

  // Point operations
  getAnchor,
  getFocus,
  getStart,
  getEnd,
  getFirstPoint,
  getLastPoint,
};

// Export methods individually
export {
  getAnchor,
  getCurrent,
  getEnd,
  getFirstPoint,
  getFocus,
  getLastPoint,
  getNext,
  getPrevious,
  getRange,
  getSelected,
  getSlateSelection,
  isBlockSelected,
  isCollapsed,
  isEmpty,
  isExpanded,
  setCurrent,
  setSelected,
  setSlateSelection,
};

// Export types
export type {
  GetCurrentOptions,
  GetNextBlockOptions,
  GetPointOptions,
  GetRangeOptions,
  GetSelectedOptions,
  GetSlateSelectionOptions,
  IsBlockSelectedOptions,
  SetCurrentOptions,
  SetSelectedOptions,
  SetSlateSelectionOptions,
} from './types';

