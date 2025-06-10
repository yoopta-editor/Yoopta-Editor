import { SlateEditor, YooEditor } from '@yoopta/editor';
import { withAccordionListItemContentNormalize } from './withAccordionListItemContentNormalize';
import { withAccordionListItemHeadingNormalize } from './withAccordionListItemHeadingNormalize';
import { withAccordionListItemNormalize } from './withAccordionListItemNormalize';
import { withAccordionListNormalize } from './withAccordionListNormalize';

export function withAccordion(slate: SlateEditor, editor: YooEditor) {
  slate = withAccordionListNormalize(slate, editor);
  slate = withAccordionListItemNormalize(slate, editor);
  slate = withAccordionListItemHeadingNormalize(slate, editor);
  slate = withAccordionListItemContentNormalize(slate, editor);

  return slate;
}
