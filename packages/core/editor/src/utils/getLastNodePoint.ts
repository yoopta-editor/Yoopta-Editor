import type { Node, Path, Point } from 'slate';
import { Editor, Element, Text } from 'slate';

import type { SlateEditor } from '../editor/types';

export function getLastNode(slate: SlateEditor): { node: Node; path: Path } {
  const lastNodeEntry = Editor.last(slate, []);
  return { node: lastNodeEntry[0], path: lastNodeEntry[1] };
}

export function getLastNodePoint(slate: SlateEditor): Point {
  try {
    let point;

    const [lastElement, lastPath] = Editor.last(slate, []);

    if (Element.isElement(lastElement) && !Editor.isEditor(lastElement)) {
      const [lastTextNode, lastTextPath] = Editor.last(slate, lastPath);

      if (Text.isText(lastTextNode)) {
        point = { path: lastTextPath, offset: lastTextNode.text.length };
      }
    } else if (Text.isText(lastElement)) {
      point = { path: lastPath, offset: lastElement.text.length };
    }

    return point;
  } catch (error) {
    return {
      path: [0, 0],
      offset: 0,
    };
  }
}
