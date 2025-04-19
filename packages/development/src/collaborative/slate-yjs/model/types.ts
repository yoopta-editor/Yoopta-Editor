import type { Editor, Element, Node } from 'slate';
import * as Y from 'yjs';

export type DeltaAttributes = {
  retain: number;
  attributes: Record<string, unknown>;
};
export type DeltaRetain = { retain: number };
export type DeltaDelete = { delete: number };
export type DeltaInsert = {
  insert: string | Y.XmlText;
  attributes?: Record<string, unknown>;
};

export type InsertDelta = Array<DeltaInsert>;
export type Delta = Array<DeltaRetain | DeltaDelete | DeltaInsert | DeltaAttributes>;

export type TextRange = { start: number; end: number };

export type HistoryStackItem = {
  meta: Map<string, unknown>;
};

export type YTarget = {
  // TextRange in the yParent mapping to the slateTarget (or position to insert)
  textRange: TextRange;

  // Y.XmlText containing the slate node
  yParent: Y.XmlText;

  // Slate element mapping to the yParent
  slateParent: Element | Editor;

  // If the target points to a slate element, Y.XmlText representing the target.
  // If it points to a text (or position to insert), this will be undefined.
  yTarget?: Y.XmlText;

  // Slate node represented by the textRange, won't be set if position is insert.
  slateTarget?: Node;

  // InsertDelta representing the slateTarget
  targetDelta: InsertDelta;
};

export type RelativeRange = {
  anchor: Y.RelativePosition;
  focus: Y.RelativePosition;
};
