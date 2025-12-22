import type { Editor, Element, Text } from 'slate';
import { ReactEditor } from 'slate-react';

import { Blocks } from '../blocks';
import type { YooEditor } from '../types';

export function htmlElToSlateNode(
  editor: YooEditor,
  blockId: string,
  htmlEl: HTMLElement,
): Editor | Element | Text | undefined {
  try {
    const block = editor.children[blockId];
    if (!block) {
      throw new Error(`Block with id ${blockId} not found`);
    }

    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) {
      throw new Error(`No slate found`);
    }

    console.log('ReactEditor.toSlateNode htmlEl', htmlEl);

    return ReactEditor.toSlateNode(slate, htmlEl);
  } catch (error) {
    return undefined;
  }
}
