import { Editor, Transforms } from 'slate';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import { YooEditor } from '../types';
import { isActive } from './isActive';

// [TODO] - check format argument
export function toggle(editor: YooEditor, type: string) {
  if (Array.isArray(editor.path.selected) && editor.path.selected.length > 0) {
    for (const path of editor.path.selected) {
      const blockSlate = Blocks.getBlockSlate(editor, { at: path });

      if (!blockSlate) continue;

      const [node] = Editor.node(blockSlate, []);
      if (!node) continue;

      const end = Editor.end(blockSlate, []);
      const start = Editor.start(blockSlate, []);

      Transforms.select(blockSlate, { anchor: start, focus: end });

      const marks = Editor.marks(blockSlate);
      const isActive = !!marks?.[type];

      if (isActive) {
        Editor.removeMark(blockSlate, type);
      } else {
        Editor.addMark(blockSlate, type, true);
      }
    }

    return;
  }

  const slate = findSlateBySelectionPath(editor);
  const active = isActive(editor, type);

  if (slate && slate.selection) {
    if (!active) {
      Editor.addMark(slate, type, true);
    } else {
      Editor.removeMark(slate, type);
    }
  }

  // editor.emit('change', { value: editor.children, operations: [] });
}
