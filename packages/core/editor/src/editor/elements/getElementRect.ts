import { Range } from 'slate';
import { ReactEditor } from 'slate-react';

import type { SlateEditor } from '../types';

export function getElementRect(
  slate: SlateEditor,
  range?: Range,
): { domRect: DOMRect; clientRect: DOMRectList } | null {
  const { selection } = slate;

  if (!range && (!selection || !Range.isCollapsed(selection))) {
    return null;
  }

  try {
    const domRange = ReactEditor.toDOMRange(slate, Range.isRange(range) ? range : selection);
    const domRect = domRange.getBoundingClientRect();
    const clientRect = domRange.getClientRects();

    return { domRect, clientRect };
  } catch (err) {
    return null;
  }
}
