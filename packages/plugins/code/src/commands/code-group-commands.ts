import type { SlateElement, YooEditor } from '@yoopta/editor';
import { Blocks, generateId } from '@yoopta/editor';
import type { Location } from 'slate';
import { Editor, Element, Node, Path, Transforms } from 'slate';

import type { CodeGroupContainerElement, CodeGroupContentElement } from '../types';
import { type FormatCodeOptions, formatCode, isLanguageSupported } from '../utils/prettier';

export type InsertTabOptions = {
  afterTabId?: string;
  at?: Location;
};

export type DeleteTabOptions = {
  tabId: string;
};

export type BeautifyTabResult = {
  success: boolean;
  error?: string;
};

export type CodeGroupCommandsType = {
  buildCodeElements: (editor: YooEditor) => CodeGroupContainerElement;
  addTabItem: (editor: YooEditor, blockId: string, options?: InsertTabOptions) => void;
  deleteTabItem: (editor: YooEditor, blockId: string, options: DeleteTabOptions) => void;
  /** Beautifies the code in the specified tab (modifies editor content) */
  beautifyTab: (
    editor: YooEditor,
    blockId: string,
    tabId: string,
    options?: FormatCodeOptions,
  ) => Promise<BeautifyTabResult>;
  /** Checks if a language supports formatting */
  isLanguageSupported: (language: string) => boolean;
};

export const CodeGroupCommands: CodeGroupCommandsType = {
  buildCodeElements: (editor: YooEditor) => {
    const tabId = generateId();
    return editor.y('code-group-container', {
      props: { activeTabId: tabId },
      children: [
        editor.y('code-group-list', {
          children: [
            editor.y('code-group-item-heading', {
              id: tabId,
              children: [editor.y.text('hellow.ts')],
            }),
          ],
        }),
        editor.y('code-group-content', {
          props: { referenceId: tabId, language: 'typescript', theme: 'github-dark' },
          children: [editor.y.text('Hello World')],
        }),
      ],
    }) as CodeGroupContainerElement;
  },

  addTabItem(editor, blockId, options) {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    // Find code-group-container
    const containerNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'code-group-container',
    });

    const containerEntry = Array.from(containerNodes)[0];
    if (!containerEntry) return;

    const [, containerPath] = containerEntry;

    // Find code-group-list
    const listNodes = Editor.nodes<SlateElement>(slate, {
      at: containerPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'code-group-list',
    });

    const listEntry = Array.from(listNodes)[0];
    if (!listEntry) return;

    const [, listPath] = listEntry;

    // Find all headings in code-group-list
    const headingNodes = Editor.nodes<SlateElement>(slate, {
      at: listPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'code-group-item-heading',
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
        match: (n) =>
          Element.isElement(n) && (n as SlateElement).type === 'code-group-item-heading',
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
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'code-group-content',
    });

    const contents = Array.from(contentNodes);
    const insertContentPath = [...containerPath, contents.length + 1]; // +1 because code-group-list is at index 0

    const newTabId = generateId();
    const defaultLanguage = 'javascript';
    const defaultTheme = 'github-dark';

    const newTabHeadingItem = editor.y('code-group-item-heading', {
      id: newTabId,
      children: [editor.y.text('New Tab')],
    });

    // Create code element for content using editor.y
    const codeElement = editor.y('code', {
      props: { language: defaultLanguage, theme: defaultTheme },
      children: [editor.y.text('')],
    });

    const newTabContentItem = editor.y('code-group-content', {
      props: { referenceId: newTabId },
      children: [codeElement],
    });

    Editor.withoutNormalizing(slate, () => {
      // Insert new heading
      Transforms.insertNodes(slate, newTabHeadingItem, { at: insertHeadingPath });

      // Insert new content with code element
      Transforms.insertNodes(slate, newTabContentItem, { at: insertContentPath });

      // Update activeTabId in code-group-container
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

    // Find code-group-container
    const containerNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'code-group-container',
    });

    const containerEntry = Array.from(containerNodes)[0];
    if (!containerEntry) return;

    const [containerNode, containerPath] = containerEntry;

    // Find all headings (in order) to get ids and decide new active tab
    const headings = Array.from(
      Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) =>
          Element.isElement(n) && (n as SlateElement).type === 'code-group-item-heading',
      }),
    );

    if (headings.length === 1) {
      Blocks.deleteBlock(editor, { blockId });
      return;
    }

    const headingIds = headings.map(([node]) => (node as SlateElement).id as string);
    const deletedIndex = headingIds.indexOf(options.tabId);
    const remainingIds = headingIds.filter((id) => id !== options.tabId);
    const newActiveId =
      remainingIds.length > 0
        ? deletedIndex > 0
          ? remainingIds[deletedIndex - 1]
          : remainingIds[0]
        : null;

    Editor.withoutNormalizing(slate, () => {
      // Find code-group-content with matching referenceId
      const contentNodes = Editor.nodes<SlateElement>(slate, {
        at: containerPath,
        match: (n) =>
          Element.isElement(n) &&
          (n as SlateElement).type === 'code-group-content' &&
          (n as SlateElement).props?.referenceId === options.tabId,
      });

      const contentEntry = Array.from(contentNodes)[0];
      if (contentEntry) {
        const [, contentPath] = contentEntry;
        Transforms.removeNodes(slate, { at: contentPath });
      }

      // Find code-group-item-heading with matching id
      const headingNodes = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) =>
          Element.isElement(n) &&
          (n as SlateElement).type === 'code-group-item-heading' &&
          (n as SlateElement).id === options.tabId,
      });

      const headingEntry = Array.from(headingNodes)[0];
      if (headingEntry) {
        const [, headingPath] = headingEntry;
        Transforms.removeNodes(slate, { at: headingPath });
      }

      if (newActiveId) {
        Transforms.setNodes<SlateElement>(
          slate,
          { props: { ...(containerNode as SlateElement).props, activeTabId: newActiveId } },
          { at: containerPath },
        );
      }
    });
  },

  beautifyTab: async (editor, blockId, tabId, options) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) {
      return { success: false, error: 'Could not access block slate' };
    }

    // Find code-group-content with matching referenceId
    const contentNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) =>
        Element.isElement(n) &&
        (n as SlateElement).type === 'code-group-content' &&
        (n as SlateElement).props?.referenceId === tabId,
    });

    const contentEntry = Array.from(contentNodes)[0];
    if (!contentEntry) {
      return { success: false, error: 'Tab content not found' };
    }

    const [contentElement, contentPath] = contentEntry;
    const language = (contentElement as CodeGroupContentElement).props?.language ?? 'javascript';

    // Use Slate's Node.string to properly extract all text content
    const currentCode = Node.string(contentElement);
    if (!currentCode.trim()) {
      return { success: false, error: 'No code to format' };
    }

    const result = await formatCode(currentCode, language, options);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Select all content in the code-group-content element and replace it
    const start = Editor.start(slate, contentPath);
    const end = Editor.end(slate, contentPath);

    Transforms.select(slate, { anchor: start, focus: end });
    Transforms.delete(slate);
    Transforms.insertText(slate, result.formatted);

    return { success: true };
  },

  isLanguageSupported,
};
