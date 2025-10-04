import type { YooEditor, YooptaContentValue } from '@yoopta/editor';

export function serializeMarkdown(editor: YooEditor, content: YooptaContentValue) {
  return editor.getMarkdown(content);
}
