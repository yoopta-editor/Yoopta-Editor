import type { YooEditor, YooptaContentValue } from '@yoopta/editor';

export function serializeEmail(editor: YooEditor, content: YooptaContentValue) {
  return editor.getEmail(content);
}
