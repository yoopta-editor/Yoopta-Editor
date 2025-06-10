import { SlateEditor, YooEditor } from '@yoopta/editor';
import { withBlockquoteNormalize } from './withBlockquoteNormalize';

export function withBlockquote(slate: SlateEditor, editor: YooEditor) {
  slate = withBlockquoteNormalize(slate, editor);
  return slate;
}
