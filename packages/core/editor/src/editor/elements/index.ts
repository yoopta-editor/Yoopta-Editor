import { deleteElement } from './deleteElement';
import { getElement } from './getElement';
import { getElementChildren } from './getElementChildren';
import { getElementEntry } from './getElementEntry';
import { getElementPath } from './getElementPath';
import { getElementRect } from './getElementRect';
import { getElements } from './getElements';
import { getParentElementPath } from './getParentElementPath';
import { insertElement } from './insertElement';
import { isElementEmpty } from './isElementEmpty';
import { updateElement } from './updateElement';

// Namespace export for backwards compatibility
export const Elements = {
  // New API methods
  insertElement,
  updateElement,
  deleteElement,
  getElement,
  getElements,
  getElementEntry,
  getElementPath,
  getElementRect,
  getParentElementPath,
  getElementChildren,
  isElementEmpty,
};

// Export new methods individually
export {
  deleteElement,
  getElement,
  getElementChildren,
  getElementEntry,
  getElementPath,
  getElementRect,
  getElements,
  getParentElementPath,
  insertElement,
  isElementEmpty,
  updateElement,
};

// Export types
export type {
  DeleteElementOptions,
  ElementMatcher,
  ElementPath,
  GetElementChildrenOptions,
  GetElementEntryOptions,
  GetElementOptions,
  GetElementPathOptions,
  GetElementRectOptions,
  GetElementsOptions,
  InsertElementOptions,
  IsElementEmptyOptions,
  UpdateElementOptions,
} from './types';
