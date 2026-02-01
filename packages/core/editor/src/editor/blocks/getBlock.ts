import type { YooEditor, YooptaBlockData, YooptaPathIndex } from '../types';

export type GetBlockOptions = {
  at?: YooptaPathIndex;
  id?: string;
};

export function getBlock(editor: YooEditor, options: GetBlockOptions): YooptaBlockData | null {
  if (!options?.id && typeof options?.at !== 'number') {
    return null;
  }

  if (options?.id) {
    return editor.children[options?.id] ?? null;
  }

  const childrenKeys = Object.keys(editor.children);

  const blockId = childrenKeys.find((childrenId) => {
    const plugin = editor.children[childrenId];
    return plugin.meta.order === options?.at;
  });

  if (!blockId) return null;
  return editor.children[blockId] ?? null;
}
