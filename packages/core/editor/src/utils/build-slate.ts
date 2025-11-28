import { createEditor } from 'slate';
import { withReact } from 'slate-react';

import { getBlockPlugins } from './get-block-plugins';
import type { SlateEditor, YooEditor } from '../editor/types';
import { withShortcuts } from '../extensions/shortcuts';

export function buildShortcuts(editor: YooEditor) {
  const blocks = getBlockPlugins(editor);
  const shortcuts = {};

  Object.values(blocks).forEach((block) => {
    const hasShortcuts =
      block.options &&
      Array.isArray(block.options?.shortcuts) &&
      block.options?.shortcuts.length > 0;

    if (hasShortcuts) {
      block.options?.shortcuts?.forEach((shortcut) => {
        shortcuts[shortcut] = { type: block.type };
      });
    }
  });

  return shortcuts;
}

// [TODO] - add slate structure from block to add elements into slate.children
export function buildSlateEditor(editor: YooEditor): SlateEditor {
  const shortcuts = buildShortcuts(editor);
  const slate = withShortcuts(editor, withReact(createEditor()), shortcuts);
  return slate;
}
