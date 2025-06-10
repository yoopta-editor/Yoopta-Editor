import { SlateEditor, YooEditor } from '@yoopta/editor';
import { withAccordionListItemNormalize } from './withAccordionListItemNormalize';
import { withAccordionListNormalize } from './withAccordionListNormalize';

export function withAccordion(slate: SlateEditor, editor: YooEditor) {
  slate = withAccordionListNormalize(slate, editor);
  slate = withAccordionListItemNormalize(slate, editor);

  return slate;
}
