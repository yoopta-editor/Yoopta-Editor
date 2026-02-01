import type { YooEditor, YooptaPath } from '../types';

export function getNextBlockOrder(editor: YooEditor, order?: number): YooptaPath['current'] {
  const path = order ?? editor.path.current;

  if (typeof path === 'number') return path + 1;
  return null;
}
