import { createElement } from './createElement';
import { deleteElement } from './deleteElement';
import { updateElement } from './updateElement';
import { insertElementText } from './insertElementText';
import { getElement } from './getElement';
import { getElementChildren } from './getElementChildren';
import { getElementEntry } from './getElementEntry';
import { getElementPath } from './getElementPath';
import { getParentElementPath } from './getParentElementPath';
import { isElementEmpty } from './isElementEmpty';
import { getElementRect } from './getElementRect';

export const Elements = {
  createElement,
  deleteElement,
  updateElement,
  insertElementText,
  getElement,
  getElementChildren,
  getElementEntry,
  isElementEmpty,
  getElementPath,
  getParentElementPath,
  getElementRect,
};

export type Elements = typeof Elements;
