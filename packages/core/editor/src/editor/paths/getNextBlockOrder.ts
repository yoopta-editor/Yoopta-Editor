import type { YooEditor, YooptaPath } from '../types';

export function getNextBlockOrder(editor: YooEditor): YooptaPath['current'] {
  const path = editor.path.current;

  if (typeof path === 'number') return path + 1;
  return null;
}
