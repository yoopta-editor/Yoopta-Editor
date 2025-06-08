import { SlateEditor, YooEditor } from '@yoopta/editor';
import { withNormalize } from './withNormalize';

export function withParagraph(slate: SlateEditor, editor: YooEditor) {
  slate = withNormalize(slate, editor);

  return slate;
}
