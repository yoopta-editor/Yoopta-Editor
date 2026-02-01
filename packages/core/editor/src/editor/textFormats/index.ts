import { addMark } from './addMark';
import { clearMarks } from './clearMarks';
import { getMarks } from './getMarks';
import { getValue } from './getValue';
import { isActive } from './isActive';
import { removeMark } from './removeMark';
import { toggle } from './toggle';
import { update } from './update';

// Namespace export for backwards compatibility
export const Marks = {
  // Core methods
  getValue,
  isActive,
  toggle,
  update,
  // Additional methods
  add: addMark,
  remove: removeMark,
  getAll: getMarks,
  clear: clearMarks,
};

// Export methods individually
export {
  addMark,
  clearMarks,
  getMarks,
  getValue,
  isActive,
  removeMark,
  toggle,
  update,
};

// Export types
export type {
  AddMarkOptions,
  ClearMarksOptions,
  GetMarkValueOptions,
  GetMarksOptions,
  IsMarkActiveOptions,
  RemoveMarkOptions,
  ToggleMarkOptions,
  UpdateMarkOptions,
} from './types';

