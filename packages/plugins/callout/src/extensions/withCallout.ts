import { YooEditor } from '@yoopta/editor';
import { SlateEditor } from '@yoopta/editor';
import { withCalloutNormalize } from './withCalloutNormalize';

export function withCallout(slate: SlateEditor, editor: YooEditor) {
  slate = withCalloutNormalize(slate, editor);

  return slate;
}
