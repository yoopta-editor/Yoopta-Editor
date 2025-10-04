import type { NodeEntry} from 'slate';
import { Editor, Element , Range, Text, Transforms } from 'slate';

import type { SlateEditor, SlateElement, YooEditor } from '../editor/types';

export const withShortcuts = (editor: YooEditor, slate: SlateEditor) => {
  const { insertText } = slate;

  slate.insertText = (text: string) => {
    const { selection } = slate;

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;

      const blockEntry: NodeEntry<SlateElement<string>> | undefined = Editor.above(slate, {
        match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
        mode: 'lowest',
      });

      if (!blockEntry) return;

      const [, currentNodePath] = blockEntry;
      const parentEntry = Editor.parent(slate, currentNodePath);
      const [parentNodeElement] = parentEntry;

      if (Element.isElement(parentNodeElement) && !Text.isText(parentNodeElement.children[0])) {
        return insertText(text);
      }

      const path = blockEntry ? currentNodePath : [];
      const start = Editor.start(slate, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(slate, range);

      const matchedBlock = editor.shortcuts?.[beforeText];
      const hasMatchedBlock = !!matchedBlock;

      if (hasMatchedBlock && !matchedBlock.isActive()) {
        Transforms.select(slate, range);
        Transforms.delete(slate);

        // [TEST]
        editor.toggleBlock(matchedBlock.type, { deleteText: true, focus: true });
        return;
      }
    }

    insertText(text);
  };

  return slate;
};
