import type { YooEditor, YooptaPathIndex } from '../types';

export function getPreviousBlockOrder(editor: YooEditor): YooptaPathIndex {
  const path = editor.path.current;

  if (typeof path === 'number' && path !== 0) return path - 1;
  return null;
}
