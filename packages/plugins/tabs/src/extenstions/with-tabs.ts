import type { SlateEditor, YooEditor } from '@yoopta/editor';

import { withTabsNormalize } from './with-tabs-normalize';

export function withTabs(slate: SlateEditor, editor: YooEditor) {
  slate = withTabsNormalize(slate, editor);

  return slate;
}
