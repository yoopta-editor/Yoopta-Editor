import { IS_FOCUSED_EDITOR } from '../../utils/weakMaps';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';

export function focus(editor: YooEditor) {
  if (editor.readOnly) return;

  const firstBlock = Blocks.getBlock(editor, { at: 0 });
  if (firstBlock) {
    IS_FOCUSED_EDITOR.set(editor, true);

    editor.focusBlock(firstBlock.id, { waitExecution: true });
    editor.emit('focus', true);
  }
}
