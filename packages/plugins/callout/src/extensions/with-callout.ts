import type { SlateEditor, YooEditor } from '@yoopta/editor';

import { withCalloutNormalize } from './with-callout-normalize';

export function withCallout(slate: SlateEditor, editor: YooEditor) {
  slate = withCalloutNormalize(slate, editor);

  return slate;
}
