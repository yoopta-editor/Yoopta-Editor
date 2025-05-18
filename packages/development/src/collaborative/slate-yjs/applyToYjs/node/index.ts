import { NodeOperation } from 'slate';
import { OpMapper } from '../types';
import { insertNode } from './insertNode';
import { mergeNode } from './mergeNode';
import { moveNode } from './moveNode';
import { removeNode } from './removeNode';
import { setNode } from './setNode';
import { splitNode } from './splitNode';

export const NODE_MAPPER: OpMapper<NodeOperation> = {
  insert_node: insertNode,
  remove_node: removeNode,
  set_node: setNode,
  merge_node: mergeNode,
  move_node: moveNode,
  split_node: splitNode,
};
