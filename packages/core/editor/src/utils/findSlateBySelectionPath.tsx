import type { SlateEditor, YooEditor, YooptaPathIndex } from '../editor/types';

export function findSlateBySelectionPath(
  editor: YooEditor,
  options?: { at: YooptaPathIndex },
): SlateEditor | undefined {
  const childrenKeys = Object.keys(editor.children);
  const { at = editor.path.current } = options || {};

  const blockId = childrenKeys.find((childrenId) => {
    const plugin = editor.children[childrenId];
    return plugin.meta.order === at;
  });

  if (!blockId) return undefined;
  return editor.blockEditorsMap[blockId];
}
