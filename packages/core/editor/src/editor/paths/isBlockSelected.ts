import type { YooEditor, YooptaBlockData } from '../types';

export function isBlockSelected(editor: YooEditor, block: YooptaBlockData): boolean {
  const selected = editor.path.selected;

  if (Array.isArray(selected)) {
    return selected.includes(block.meta.order);
  }

  return false;
}
