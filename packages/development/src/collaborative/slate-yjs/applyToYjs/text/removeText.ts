import { Node, RemoveTextOperation } from 'slate';
import type Y from 'yjs';
import { getYTarget } from '../../utils/location';

export function removeText(
  sharedRoot: Y.XmlText,
  slateRoot: Node,
  op: RemoveTextOperation
): void {
  const { yParent: target, textRange } = getYTarget(
    sharedRoot,
    slateRoot,
    op.path
  );
  target.delete(textRange.start + op.offset, op.text.length);
}
