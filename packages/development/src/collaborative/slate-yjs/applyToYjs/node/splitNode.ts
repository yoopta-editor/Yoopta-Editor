import { Node, SplitNodeOperation, Text } from 'slate';
import * as Y from 'yjs';
import { cloneInsertDeltaDeep } from '../../utils/clone';
import { sliceInsertDelta, yTextToInsertDelta } from '../../utils/delta';
import { getSlateNodeYLength, getYTarget } from '../../utils/location';
import {
  getStoredPositionsInDeltaAbsolute,
  restoreStoredPositionsWithDeltaAbsolute,
} from '../../utils/position';

export function splitNode(
  sharedRoot: Y.XmlText,
  slateRoot: Node,
  op: SplitNodeOperation
): void {
  const target = getYTarget(sharedRoot, slateRoot, op.path);

  if (!target.slateTarget) {
    throw new Error('Y target without corresponding slate node');
  }

  if (!target.yTarget) {
    if (!Text.isText(target.slateTarget)) {
      throw new Error('Mismatch node type between y target and slate node');
    }

    const unset: Record<string, null> = {};
    target.targetDelta.forEach((element) => {
      if (element.attributes) {
        Object.keys(element.attributes).forEach((key) => {
          unset[key] = null;
        });
      }
    });

    return target.yParent.format(
      target.textRange.start,
      target.textRange.end - target.textRange.start,
      { ...unset, ...op.properties }
    );
  }

  if (Text.isText(target.slateTarget)) {
    throw new Error('Mismatch node type between y target and slate node');
  }

  const splitTarget = getYTarget(target.yTarget, target.slateTarget, [
    op.position,
  ]);

  const ySplitOffset = target.slateTarget.children
    .slice(0, op.position)
    .reduce((length, child) => length + getSlateNodeYLength(child), 0);

  const length = target.slateTarget.children.reduce(
    (current, child) => current + getSlateNodeYLength(child),
    0
  );

  const splitDelta = sliceInsertDelta(
    yTextToInsertDelta(target.yTarget),
    ySplitOffset,
    length - ySplitOffset
  );
  const clonedDelta = cloneInsertDeltaDeep(splitDelta);

  const storedPositions = getStoredPositionsInDeltaAbsolute(
    sharedRoot,
    target.yTarget,
    splitDelta,
    ySplitOffset
  );

  const toInsert = new Y.XmlText();
  toInsert.applyDelta(clonedDelta, {
    sanitize: false,
  });

  Object.entries(op.properties).forEach(([key, value]) => {
    toInsert.setAttribute(key, value);
  });

  target.yTarget.delete(
    splitTarget.textRange.start,
    target.yTarget.length - splitTarget.textRange.start
  );

  target.yParent.insertEmbed(target.textRange.end, toInsert);

  restoreStoredPositionsWithDeltaAbsolute(
    sharedRoot,
    toInsert,
    storedPositions,
    clonedDelta,
    0,
    ySplitOffset
  );
}
