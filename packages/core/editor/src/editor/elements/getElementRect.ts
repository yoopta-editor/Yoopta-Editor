import { Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { SlateEditor, YooEditor } from '../types';

export function getElementRect(editor: YooEditor, slate: SlateEditor): DOMRect | null {
  const { selection } = slate;

  if (!selection || !Range.isCollapsed(selection)) {
    return null;
  }

  try {
    const domRange = ReactEditor.toDOMRange(slate, selection);
    const rect = domRange.getBoundingClientRect();

    return rect;
  } catch (err) {
    console.error('Error getting selection coordinates:', err);
    return null;
  }
}
