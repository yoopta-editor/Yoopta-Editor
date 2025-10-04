import { IS_FOCUSED_EDITOR } from '../../utils/weakMaps';
import type { YooEditor } from '../types';

export function isFocused(editor: YooEditor) {
  return !!IS_FOCUSED_EDITOR.get(editor);
}
