import { YooEditor, YooptaPath } from '../types';

export function setPath(editor: YooEditor, path: YooptaPath) {
  editor.applyTransforms([{ type: 'set_path', path }], { validatePaths: false });
}
