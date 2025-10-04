import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { IS_FOCUSED_EDITOR } from '../../utils/weakMaps';
import type { SlateEditor, YooEditor } from '../types';

export type EditorBlurOptions = {
  waitExecution?: boolean;
  waitExecutionMs?: number;
  slate?: SlateEditor;
};

function blurFn(editor: YooEditor, slate: SlateEditor) {
  try {
    ReactEditor.blur(slate);
    ReactEditor.deselect(slate);
    Transforms.deselect(slate);
  } catch (error) {}

  editor.setPath({ current: null });
}

export function blur(editor: YooEditor, options: EditorBlurOptions = {}) {
  const slate = options.slate ?? findSlateBySelectionPath(editor);

  if (!slate) return;

  const { waitExecution, waitExecutionMs } = options;

  if (waitExecution) {
    setTimeout(() => blurFn(editor, slate), waitExecutionMs);
    return;
  }

  IS_FOCUSED_EDITOR.set(editor, false);
  blurFn(editor, slate);
  editor.emit('blur', false);
}
