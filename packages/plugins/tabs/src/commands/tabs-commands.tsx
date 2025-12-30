import type { SlateElement, YooEditor } from '@yoopta/editor';
import { Blocks, generateId } from '@yoopta/editor';
import type { Location } from 'slate';
import { Editor, Element, Path, Transforms } from 'slate';

export type InsertOptions = {
  afterTabId?: string;
  at?: Location;
};

export type DeleteOptions = {
  tabId: string;
};

export type TabsCommandsType = {
  addTabItem: (editor: YooEditor, blockId: string, options?: InsertOptions) => void;
  deleteTabItem: (editor: YooEditor, blockId: string, options: DeleteOptions) => void;
};

export const TabsCommands: TabsCommandsType = {
  addTabItem(editor, blockId, options) {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    // Find tabs-container
    const containerNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-container',
    });

    const containerEntry = Array.from(containerNodes)[0];
    if (!containerEntry) return;

    const [, containerPath] = containerEntry;

    // Find tabs-list
    const listNodes = Editor.nodes<SlateElement>(slate, {
      at: containerPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-list',
    });

    const listEntry = Array.from(listNodes)[0];
    if (!listEntry) return;

    const [, listPath] = listEntry;

    // Find all headings in tabs-list
    const headingNodes = Editor.nodes<SlateElement>(slate, {
      at: listPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-heading',
    });

    const headings = Array.from(headingNodes);

    let insertHeadingPath: number[];

    // If options.at is provided, use it
    if (options?.at && Path.isPath(options.at)) {
      insertHeadingPath = Path.next(options.at);
    } else if (options?.afterTabId) {
      // Find heading with matching id and insert after it
      const targetHeading = headings.find(
        ([node]) => (node as SlateElement).id === options.afterTabId,
      );
      if (targetHeading) {
        const [, path] = targetHeading;
        insertHeadingPath = Path.next(path);
      } else {
        insertHeadingPath = [...listPath, headings.length];
      }
    } else if (slate.selection) {
      // If there's a selection, find current heading and insert after it
      const selectionPath = slate.selection.anchor.path;

      let currentHeadingPath: number[] | undefined;

      const parentEntry = Editor.above(slate, {
        at: selectionPath,
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-heading',
      });

      if (parentEntry) {
        const [, path] = parentEntry;
        currentHeadingPath = path;
      } else {
        for (const [, path] of headings) {
          if (Path.isDescendant(selectionPath, path) || Path.equals(selectionPath, path)) {
            currentHeadingPath = path;
            break;
          }
        }
      }

      if (currentHeadingPath) {
        insertHeadingPath = Path.next(currentHeadingPath);
      } else {
        insertHeadingPath = [...listPath, headings.length];
      }
    } else {
      // No selection, insert at the end
      insertHeadingPath = [...listPath, headings.length];
    }

    // Find all content elements to get insert position
    const contentNodes = Editor.nodes<SlateElement>(slate, {
      at: containerPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-content',
    });

    const contents = Array.from(contentNodes);
    const insertContentPath = [...containerPath, contents.length + 1]; // +1 because tabs-list is at index 0

    const newTabId = generateId();

    const newTabHeadingItem = editor.y('tabs-item-heading', {
      id: newTabId,
      children: [editor.y.text('New Tab')],
    });

    const newTabContentItem = editor.y('tabs-item-content', {
      props: { referenceId: newTabId },
      children: [editor.y.text('')],
    });

    Editor.withoutNormalizing(slate, () => {
      // Insert new heading
      Transforms.insertNodes(slate, newTabHeadingItem, { at: insertHeadingPath });

      // Insert new content
      Transforms.insertNodes(slate, newTabContentItem, { at: insertContentPath });

      // Update activeTabId in tabs-container
      Transforms.setNodes<SlateElement>(
        slate,
        { props: { ...(containerEntry[0] as SlateElement).props, activeTabId: newTabId } },
        { at: containerPath },
      );

      // Focus on new tab heading
      const nextLeafPath = [...insertHeadingPath, 0];
      setTimeout(() => {
        Transforms.select(slate, { offset: 0, path: nextLeafPath });
      }, 0);
    });
  },

  deleteTabItem(editor, blockId, options) {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    // Find tabs-container
    const containerNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-container',
    });

    const containerEntry = Array.from(containerNodes)[0];
    if (!containerEntry) return;

    const [, containerPath] = containerEntry;

    // Find all headings to check count
    const headings = Array.from(
      Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'tabs-item-heading',
      }),
    );

    Editor.withoutNormalizing(slate, () => {
      if (headings.length === 1) {
        Blocks.deleteBlock(editor, { blockId });
        return;
      }

      // Find tabs-item-content with matching referenceId
      const contentNodes = Editor.nodes<SlateElement>(slate, {
        at: containerPath,
        match: (n) =>
          Element.isElement(n) &&
          (n as SlateElement).type === 'tabs-item-content' &&
          (n as SlateElement).props?.referenceId === options.tabId,
      });

      const contentEntry = Array.from(contentNodes)[0];
      if (contentEntry) {
        const [, contentPath] = contentEntry;
        Transforms.removeNodes(slate, { at: contentPath });
      }

      // Find tabs-item-heading with matching id
      const headingNodes = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) =>
          Element.isElement(n) &&
          (n as SlateElement).type === 'tabs-item-heading' &&
          (n as SlateElement).id === options.tabId,
      });

      const headingEntry = Array.from(headingNodes)[0];
      if (headingEntry) {
        const [, headingPath] = headingEntry;
        Transforms.removeNodes(slate, { at: headingPath });
      }
    });
  },
};
