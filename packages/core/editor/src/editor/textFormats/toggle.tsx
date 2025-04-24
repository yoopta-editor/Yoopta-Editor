import { Editor, Transforms } from 'slate';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import { SlateEditor, YooEditor } from '../types';
import { isActive } from './isActive';

type SelectedBlockEntity = {
  isActiveMark: boolean;
  slate: SlateEditor;
};

// [TODO] - check format argument
export function toggle(editor: YooEditor, type: string) {
  // [TODO] - batch these operations
  if (Array.isArray(editor.path.selected) && editor.path.selected.length > 0) {
    const selectedBlockEntities: SelectedBlockEntity[] = editor.path.selected.map((path) => {
      const blockSlate = Blocks.getBlockSlate(editor, { at: path });

      if (!blockSlate) return { isActiveMark: false, slate: blockSlate };
      const [node] = Editor.node(blockSlate, []);

      if (!node) return { isActiveMark: false, slate: blockSlate };
      const end = Editor.end(blockSlate, []);
      const start = Editor.start(blockSlate, []);
      Transforms.select(blockSlate, { anchor: start, focus: end });

      const marks = Editor.marks(blockSlate);

      return {
        slate: blockSlate,
        isActiveMark: !!marks?.[type],
      };
    });

    const isAllActive = selectedBlockEntities.every((entity) => entity.isActiveMark);

    for (const blockEntity of selectedBlockEntities) {
      if (blockEntity.isActiveMark) {
        if (isAllActive) {
          Editor.removeMark(blockEntity.slate, type);
        }
      } else {
        Editor.addMark(blockEntity.slate, type, true);
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
