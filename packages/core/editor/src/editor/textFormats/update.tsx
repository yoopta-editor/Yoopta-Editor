import { Editor, Range, Transforms } from 'slate';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import { YooEditor } from '../types';

export function update(editor: YooEditor, type: any, value: any) {
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
        Editor.addMark(blockSlate, type, value);
      }
    }

    return;
  }

  const slate = findSlateBySelectionPath(editor);

  if (!slate || !slate.selection) return;

  if (Range.isExpanded(slate.selection)) {
    Editor.addMark(slate, type, value);
  }
}
