import type { SlateEditor, YooEditor } from '@yoopta/editor';

export function withTabsNormalize(slate: SlateEditor, _editor: YooEditor): SlateEditor {
  const { normalizeNode } = slate;

  slate.normalizeNode = (entry, options) => {
    normalizeNode(entry, options);
  };

  return slate;
}
