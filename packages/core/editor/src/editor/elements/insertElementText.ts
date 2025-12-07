import { Editor, Range, Transforms } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { Blocks } from '../blocks';
import type { YooEditor } from '../types';

export type UpdateElementTextOptions = {
  focus?: boolean;
  blockId?: string;
};

export function insertElementText<TElementKeys extends string, TElementProps>(
  editor: YooEditor,
  text: string,
  options?: UpdateElementTextOptions,
) {
  const { blockId, focus } = options || {};

  const blockData = blockId
    ? editor.children[blockId]
    : Blocks.getBlock(editor, { at: editor.path.current });

  if (!blockData) {
    console.warn(`To set text programmatically, you must provide a valid blockId. Got: ${blockId}`);
    return;
  }

  const slate = findSlateBySelectionPath(editor, { at: blockData.meta.order });

  if (!slate) {
    console.warn('No slate found');
    return;
  }

  const blockPlugin = editor.plugins[blockData.type];
  const latestBlockElementPath = Array.from(
    { length: Object.keys(blockPlugin.elements).length },
    (_) => 0,
  );
  const path = slate.selection || latestBlockElementPath;

  if (!path) {
    console.warn('No valid path or selection found for text insertion');
    return;
  }

  Editor.withoutNormalizing(slate, () => {
    if (Range.isRange(path) && !Range.isCollapsed(path)) {
      Transforms.collapse(slate, { edge: 'end' });
    }

    Transforms.insertText(slate, text, { at: path });
    // editor.emit('change', { value: editor.children, operations: [] });

    if (focus) {
      editor.focusBlock(blockData.id, { waitExecution: true, shouldUpdateBlockPath: true });
    }
  });
}
