import { createElement } from './createElement';
import { deleteElement } from './deleteElement';
import { getElement } from './getElement';
import { getElementChildren } from './getElementChildren';
import { getElementEntry } from './getElementEntry';
import { getElementPath } from './getElementPath';
import { getElementRect } from './getElementRect';
import { getParentElementPath } from './getParentElementPath';
import { insertElementText } from './insertElementText';
import { isElementEmpty } from './isElementEmpty';
import { updateElement } from './updateElement';
import { createJSXFactory } from './create-element-structure';

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
  createJSXFactory,
};

export type Elements = typeof Elements;
