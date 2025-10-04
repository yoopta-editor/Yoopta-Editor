import { getNextPath } from './getNextPath';
import { getPath } from './getPath';
import { getPreviousPath } from './getPreviousPath';
import { getSelectedPaths } from './getSelectedPaths';
import { isBlockSelected } from './isBlockSelected';
import { isPathEmpty } from './isPathEmpty';
import { setPath } from './setPath';
import { getLastNodePoint } from '../../utils/getLastNodePoint';

export const Paths = {
  getPath,
  getNextPath,
  getPreviousPath,
  isBlockSelected,
  getSelectedPaths,
  isPathEmpty,
  setPath,
  getLastNodePoint,
};

export type Paths = typeof Paths;
