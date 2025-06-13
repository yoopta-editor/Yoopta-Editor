import { SlateEditor, YooEditor } from '@yoopta/editor';
import { withDelete } from './withDelete';
import { withTableNormalize } from './withTableNormalize';
import { withSelection } from './withSelection';

export function withTable(slate: SlateEditor, editor: YooEditor) {
  slate = withSelection(slate);
  slate = withTableNormalize(slate, editor);
  slate = withDelete(slate);

  return slate;
}
