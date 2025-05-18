import { Element, Node, Text } from 'slate';
import * as Y from 'yjs';
import { DeltaInsert, InsertDelta } from '../model/types';
import { yTextToInsertDelta } from './delta';
import { getProperties } from './slate';

export function yTextToSlateElement(yText: Y.XmlText): Element {
  const delta = yTextToInsertDelta(yText);

  const children =
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    delta.length > 0 ? delta.map(deltaInsertToSlateNode) : [{ text: '' }];

  return { ...yText.getAttributes(), children };
}

export function deltaInsertToSlateNode(insert: DeltaInsert): Node {
  if (typeof insert.insert === 'string') {
    return { ...insert.attributes, text: insert.insert };
  }

  return yTextToSlateElement(insert.insert);
}

export function slateNodesToInsertDelta(nodes: Node[]): InsertDelta {
  return nodes.map((node) => {
    if (Text.isText(node)) {
      return { insert: node.text, attributes: getProperties(node) };
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return { insert: slateElementToYText(node) };
  });
}

export function slateElementToYText({
  children,
  ...attributes
}: Element): Y.XmlText {
  const yElement = new Y.XmlText();

  Object.entries(attributes).forEach(([key, value]) => {
    yElement.setAttribute(key, value);
  });

  yElement.applyDelta(slateNodesToInsertDelta(children), { sanitize: false });
  return yElement;
}
