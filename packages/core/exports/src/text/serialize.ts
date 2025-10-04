import type { YooEditor, YooptaContentValue } from '@yoopta/editor';

export function serializeText(editor: YooEditor, content: YooptaContentValue) {
  return editor.getPlainText(content);
}
