import { YooEditor } from '@yoopta/editor';
import { SlateEditor } from '@yoopta/editor';
import { withNormalize } from './withNormalize';

export function withCallout(slate: SlateEditor, editor: YooEditor) {
  slate = withNormalize(slate, editor);

  return slate;
}
