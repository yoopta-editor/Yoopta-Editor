import { Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { SlateEditor, YooEditor } from '../types';

export function getElementRect(
  editor: YooEditor,
  slate: SlateEditor,
): { domRect: DOMRect; clientRect: DOMRectList } | null {
  const { selection } = slate;

  if (!selection || !Range.isCollapsed(selection)) {
    return null;
  }

  try {
    const domRange = ReactEditor.toDOMRange(slate, selection);
    const domRect = domRange.getBoundingClientRect();
    const clientRect = domRange.getClientRects();

    return { domRect, clientRect };
  } catch (err) {
    console.error('Error getting selection coordinates:', err);
    return null;
  }
}
