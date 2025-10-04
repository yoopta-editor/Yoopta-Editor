import type { YooEditor, YooptaPathIndex } from '../types';

export type GetBlockOptions = {
  at?: YooptaPathIndex;
  id?: string;
};

export function getBlock(editor: YooEditor, options: GetBlockOptions) {
  if (!options?.id && typeof options?.at !== 'number') {
    throw new Error('getBlock requires either an id or at');
  }

  if (options?.id) {
    return editor.children[options?.id];
  }

  const childrenKeys = Object.keys(editor.children);

  const blockId = childrenKeys.find((childrenId) => {
    const plugin = editor.children[childrenId];
    return plugin.meta.order === options?.at;
  });

  if (!blockId) return null;
  return editor.children[blockId];
}
