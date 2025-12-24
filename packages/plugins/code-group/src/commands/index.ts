import type { SlateElement, YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, buildBlockData, generateId } from '@yoopta/editor';
import type { Location } from 'slate';
import { Editor, Element, Path, Transforms } from 'slate';

import type { CodeGroupElement, CodeGroupElementProps } from '../types';

type CodeGroupElementOptions = {
  text?: string;
  props?: CodeGroupElementProps;
};

type InsertCodeOptions = CodeGroupElementOptions & {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type InsertTabOptions = {
  afterTabId?: string;
  at?: Location;
};

export type DeleteTabOptions = {
  tabId: string;
};

export type CodeGroupCommandsType = {
  buildCodeElements: (
    editor: YooEditor,
    options?: Partial<CodeGroupElementOptions>,
  ) => CodeGroupElement;
  insertCode: (editor: YooEditor, options?: Partial<InsertCodeOptions>) => void;
  deleteCode: (editor: YooEditor, blockId: string) => void;
  updateCodeTheme: (
    editor: YooEditor,
    blockId: string,
    theme: CodeGroupElementProps['theme'],
  ) => void;
  updateCodeLanguage: (
    editor: YooEditor,
    blockId: string,
    language: CodeGroupElementProps['language'],
  ) => void;
  addTabItem: (editor: YooEditor, blockId: string, options?: InsertTabOptions) => void;
  deleteTabItem: (editor: YooEditor, blockId: string, options: DeleteTabOptions) => void;
};

export const CodeGroupCommands: CodeGroupCommandsType = {
  buildCodeElements: (editor: YooEditor, options = {}) => ({
    id: generateId(),
    type: 'code',
    children: [{ text: options?.text ?? '', props: options?.props }],
  }),
  insertCode: (editor: YooEditor, options = {}) => {
    const { at, focus, text, props } = options;
    const code = CodeGroupCommands.buildCodeElements(editor, { text, props });
    const block = buildBlockData({ value: [code], type: 'Code' });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },
  deleteCode: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
  updateCodeTheme: (editor: YooEditor, blockId, theme) => {
    const block = editor.children[blockId];
    const element = block.value[0] as CodeGroupElement;
    Blocks.updateBlock(editor, blockId, {
      value: [{ ...element, props: { ...element.props, theme } }],
    });
  },
  updateCodeLanguage: (editor: YooEditor, blockId, language) => {
    const block = editor.children[blockId];
    const element = block.value[0] as CodeGroupElement;
    Blocks.updateBlock(editor, blockId, {
      value: [{ ...element, props: { ...element.props, language } }],
    });
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

    const [, containerPath] = containerEntry;

    // Find all headings to check count
    const headings = Array.from(
      Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) =>
          Element.isElement(n) && (n as SlateElement).type === 'code-group-item-heading',
      }),
    );

    Editor.withoutNormalizing(slate, () => {
      if (headings.length === 1) {
        Blocks.deleteBlock(editor, { blockId });
        return;
      }

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
    });
  },
};
