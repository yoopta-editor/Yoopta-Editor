import type { YooEditor, YooptaContentValue } from '@yoopta/editor';

export function serializeHTML(editor: YooEditor, content: YooptaContentValue) {
  return editor.getHTML(content);
}
