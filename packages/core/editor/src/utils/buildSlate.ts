import { createEditor } from 'slate';
import { withReact } from 'slate-react';

import type { SlateEditor, YooEditor } from '../editor/types';
import { withShortcuts } from '../extensions/shortcuts';

// [TODO] - add slate structure from block to add elements into slate.children
export function buildSlateEditor(editor: YooEditor): SlateEditor {
  const slate = withShortcuts(editor, withReact(createEditor()));
  return slate;
}
