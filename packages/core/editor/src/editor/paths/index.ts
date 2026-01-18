import { getBlockOrder } from './getBlockOrder';
import { getNextBlockOrder } from './getNextBlockOrder';
import { getPreviousBlockOrder } from './getPreviousBlockOrder';
import { getSelectedPaths } from './getSelectedPaths';
import { isBlockSelected } from './isBlockSelected';
import { isPathEmpty } from './isPathEmpty';
import { setPath } from './setPath';
import { getLastNodePoint } from '../../utils/get-node-points';
import { getFirstPoint } from '../selection/getFirstPoint';
import { getLastPoint } from '../selection/getLastPoint';

// Re-export Selection API methods for backward compatibility
export const Paths = {
  getBlockOrder,
  getNextBlockOrder,
  getPreviousBlockOrder,
  isBlockSelected,
  getSelectedPaths,
  isPathEmpty,
  setPath,
  getLastNodePoint,
  // Add new Selection API methods
  getFirstNodePoint: getFirstPoint,
};

export type Paths = typeof Paths;
