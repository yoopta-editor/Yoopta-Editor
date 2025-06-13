import { SlateEditor, YooEditor } from '@yoopta/editor';
import { withParagraphNormalize } from './withParagraphNormalize';

export function withParagraph(slate: SlateEditor, editor: YooEditor) {
  slate = withParagraphNormalize(slate, editor);

  return slate;
}
