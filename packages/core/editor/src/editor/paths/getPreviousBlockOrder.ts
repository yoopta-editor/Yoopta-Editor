import type { YooEditor, YooptaPathIndex } from '../types';

export function getPreviousBlockOrder(editor: YooEditor, order?: number): YooptaPathIndex {
  const path = order ?? editor.path.current;

  if (typeof path === 'number' && path !== 0) return path - 1;
  return null;
}
