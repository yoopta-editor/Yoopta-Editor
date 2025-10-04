import type { YooEditor, YooptaPathIndex } from '../editor/types';

export function findPluginBlockByPath(editor: YooEditor, options?: { at: YooptaPathIndex }) {
  const childrenKeys = Object.keys(editor.children);
  const { at = editor.path.current } = options || {};

  const blockId = childrenKeys.find((childrenId) => {
    const plugin = editor.children[childrenId];
    return plugin.meta.order === at;
  });

  if (!blockId) return null;
  return editor.children[blockId];
}
