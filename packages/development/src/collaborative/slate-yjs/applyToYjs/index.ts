import { Node, Operation } from 'slate';
import * as Y from 'yjs';
import { NODE_MAPPER } from './node';
import { TEXT_MAPPER } from './text';
import { ApplyFunc, OpMapper } from './types';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NOOP = () => {};

const opMappers: OpMapper = {
  ...TEXT_MAPPER,
  ...NODE_MAPPER,

  set_selection: NOOP,
};

export function applySlateOp(
  sharedRoot: Y.XmlText,
  slateRoot: Node,
  op: Operation
): void {
  const apply = opMappers[op.type] as ApplyFunc<typeof op>;
  if (!apply) {
    throw new Error(`Unknown operation: ${op.type}`);
  }

  apply(sharedRoot, slateRoot, op);
}
