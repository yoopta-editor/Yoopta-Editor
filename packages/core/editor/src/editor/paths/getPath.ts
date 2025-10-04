import type { YooEditor, YooptaPath } from '../types';

export function getPath(editor: YooEditor): YooptaPath['current'] {
  return editor.path.current;
}
