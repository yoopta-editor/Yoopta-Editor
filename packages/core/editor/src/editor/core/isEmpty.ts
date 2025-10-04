import { Editor } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { YooEditor } from '../types';

export function isEmpty(editor: YooEditor): boolean {
  const content = Object.values(editor.children);
  if (content.length > 1) return false;

  const blockData = content[0];
  if (!blockData) return true;

  if (blockData.type !== 'Paragraph') return false;

  const slate = findSlateBySelectionPath(editor, { at: blockData.meta.order });
  if (!slate) return true;

  try {
    const string = Editor.string(slate, [0]);
    if (string.length > 0) return false;

    return true;
  } catch (error) {
    return true;
  }
}
