import { Editor, Path, Point, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { IS_FOCUSED_EDITOR } from '../../utils/weakMaps';
import type { FocusAt, SlateEditor, YooEditor } from '../types';

export type FocusBlockOptions = {
  waitExecution?: boolean;
  waitExecutionMs?: number;
  shouldUpdateBlockPath?: boolean;
  focusAt?: FocusAt;
  slate?: SlateEditor;
};

function getSelectionPath(slate: SlateEditor, focusAt?: FocusAt): FocusAt {
  if (Point.isPoint(focusAt)) {
    return focusAt;
  }

  if (Path.isPath(focusAt)) {
    return { path: focusAt, offset: 0 };
  }

  const [, firstNodePath] = Editor.first(slate, [0]);
  const firstLeafPath = firstNodePath || [0, 0];

  return { path: firstLeafPath, offset: 0 };
}

// [TODO] - update editor.path after focus
export function focusBlock(editor: YooEditor, blockId: string, options: FocusBlockOptions = {}) {
  const {
    focusAt,
    waitExecution = true,
    waitExecutionMs = 0,
    shouldUpdateBlockPath = true,
  } = options;

  const focusBlockEditor = () => {
    const slate = options.slate || editor.blockEditorsMap[blockId];
    const block = editor.children[blockId];

    if (!slate || !block) return;

    try {
      const selectionPath = getSelectionPath(slate, focusAt);
      Transforms.select(slate, selectionPath);
      ReactEditor.focus(slate);
    } catch (error) {
      // Ignore focus errors
    }

    // Re-sync DOM selection after React's layout effects.
    // When a new block is mounted, slate-react's layout effect may call toDOMRange()
    // on stale DOM nodes and fall back to domSelection.removeAllRanges(), wiping the
    // cursor even though the element has focus. Re-setting the DOM selection in a
    // requestAnimationFrame (which fires after layout effects, before paint) restores it.
    requestAnimationFrame(() => {
      try {
        if (slate.selection) {
          const domRange = ReactEditor.toDOMRange(slate, slate.selection);
          const domSelection = window.getSelection();
          if (domSelection) {
            domSelection.removeAllRanges();
            domSelection.addRange(domRange);
          }
        }
      } catch {
        // DOM nodes may not be ready yet — safe to ignore
      }
    });

    if (shouldUpdateBlockPath) {
      setTimeout(() => {
        editor.setPath({ current: block.meta.order });
      }, 0);
    }
  };

  if (waitExecution) {
    setTimeout(() => focusBlockEditor(), waitExecutionMs);
  } else {
    focusBlockEditor();
  }

  IS_FOCUSED_EDITOR.set(editor, true);
}
