import type { YooEditor } from '../types';

export function isPathEmpty(editor: YooEditor): boolean {
  return editor.path.current === null;
}
