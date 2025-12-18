import { getBlockOrder } from './getBlockOrder';
import { getNextBlockOrder } from './getNextBlockOrder';
import { getPreviousBlockOrder } from './getPreviousBlockOrder';
import { getSelectedPaths } from './getSelectedPaths';
import { isBlockSelected } from './isBlockSelected';
import { isPathEmpty } from './isPathEmpty';
import { setPath } from './setPath';
import { getLastNodePoint } from '../../utils/get-node-points';

export const Paths = {
  getBlockOrder,
  getNextBlockOrder,
  getPreviousBlockOrder,
  isBlockSelected,
  getSelectedPaths,
  isPathEmpty,
  setPath,
  getLastNodePoint,
};

export type Paths = typeof Paths;
