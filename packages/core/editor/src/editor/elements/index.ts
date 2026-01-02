import { createJSXFactory } from './create-element-structure';
import { deleteElement } from './deleteElement';
import { getElement } from './getElement';
import { getElementChildren } from './getElementChildren';
import { getElementEntry } from './getElementEntry';
import { getElementPath } from './getElementPath';
import { getElementRect } from './getElementRect';
import { getElements } from './getElements';
import { getParentElementPath } from './getParentElementPath';
import { htmlElToSlateNode } from './htmlElToSlateNode';
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
  getParentElementPath,
  getElementChildren,
  isElementEmpty,

  // Legacy methods (kept for backwards compatibility)
  getElementRect,
  createJSXFactory,
  htmlElToSlateNode,
};

// Export new methods individually
export {
  deleteElement,
  getElement,
  getElementChildren,
  getElementEntry,
  getElementPath,
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
  GetElementsOptions,
  InsertElementOptions,
  IsElementEmptyOptions,
  UpdateElementOptions,
} from './types';
