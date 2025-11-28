import type { YooEditor, YooptaPath } from '../types';

export function getBlockOrder(editor: YooEditor): YooptaPath['current'] {
  return editor.path.current;
}
