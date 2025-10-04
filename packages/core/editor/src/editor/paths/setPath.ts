import type { YooEditor, YooptaPath } from '../types';

export function setPath(editor: YooEditor, path: YooptaPath) {
  editor.applyTransforms([{ type: 'set_block_path', path }], { validatePaths: false });
}
