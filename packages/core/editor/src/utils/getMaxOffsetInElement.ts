import { Editor, Node, Text } from 'slate';

export function getMaxOffsetInElement(editor, elementPath) {
  let totalLength = 0;

  for (const [node] of Node.descendants(Editor.node(editor, elementPath)[0], {
    from: elementPath,
  })) {
    if (Text.isText(node)) {
      totalLength += node.text.length;
    }
  }

  return totalLength;
}
