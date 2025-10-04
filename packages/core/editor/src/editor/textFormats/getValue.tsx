import { Editor } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { YooEditor } from '../types';

export function getValue(editor: YooEditor, type: string) {
  const slate = findSlateBySelectionPath(editor);

  if (!slate) return null;
  const marks = Editor.marks(slate);
  return marks?.[type];
}
