import type { YooEditor, YooptaPath } from '../types';

export function getSelectedPaths(editor: YooEditor): YooptaPath['selected'] {
  return editor.path.selected;
}
