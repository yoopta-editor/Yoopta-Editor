import type { SlateEditor, SlateElement } from '@yoopta/editor';
import { Editor, Element, Operation, Path, Range } from 'slate';

import type { TableCellElement } from '../types';
import type {
  SlateNodeEntry} from '../utils/weakMaps';
import {
  EDITOR_TO_SELECTION,
  TABLE_SLATE_TO_SELECTION_SET
} from '../utils/weakMaps';

export function withSelection(slate: SlateEditor): SlateEditor {
  const { apply } = slate;

  slate.apply = (op) => {
    if (!Operation.isSelectionOperation(op) || !op.newProperties) {
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
      EDITOR_TO_SELECTION.delete(slate);
      return apply(op);
    }

    const selection = {
      ...slate.selection,
      ...op.newProperties,
    };

    if (!Range.isRange(selection)) {
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
      EDITOR_TO_SELECTION.delete(slate);

      return apply(op);
    }

    const [fromEntry] = Editor.nodes(slate, {
      match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
      at: Range.start(selection),
    });

    const [toEntry] = Editor.nodes(slate, {
      match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
      at: Range.end(selection),
    });

    if (!fromEntry || !toEntry) {
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
      EDITOR_TO_SELECTION.delete(slate);

      return apply(op);
    }

    const [, fromPath] = fromEntry;
    const [, toPath] = toEntry;

    if (Path.equals(fromPath, toPath)) {
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
      EDITOR_TO_SELECTION.delete(slate);

      return apply(op);
    }

    const selectedSet = new WeakSet<SlateElement>();

    const range = Editor.range(slate, fromPath, toPath);
    const nodesInRange = Array.from(
      Editor.nodes(slate, {
        at: range,
        match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
      }),
    );

    const selected: SlateNodeEntry[] = [];

    for (const [element, path] of nodesInRange) {
      if (Element.isElement(element) && element.type === 'table-data-cell') {
        selectedSet.add(element);
        selected.push([element as TableCellElement, path]);
      }
    }

    EDITOR_TO_SELECTION.set(slate, selected);
    TABLE_SLATE_TO_SELECTION_SET.set(slate, selectedSet);

    apply(op);
  };

  return slate;
}
