import type { SlateEditor, YooEditor } from '@yoopta/editor';

import { withDelete } from './withDelete';
import { withSelection } from './withSelection';
import { withTableNormalize } from './withTableNormalize';

export function withTable(slate: SlateEditor, editor: YooEditor) {
  slate = withSelection(slate);
  slate = withTableNormalize(slate, editor);
  slate = withDelete(slate);

  return slate;
}
