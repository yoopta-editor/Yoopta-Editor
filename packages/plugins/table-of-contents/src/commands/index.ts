import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, Elements, buildBlockData, generateId } from '@yoopta/editor';

import type {
  TableOfContentsElement,
  TableOfContentsElementProps,
} from '../types';
import { DEFAULT_HEADING_TYPES } from '../types';

type TableOfContentsInsertOptions = Partial<TableOfContentsElementProps> & {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type TableOfContentsCommands = {
  buildTableOfContentsElements: (
    editor: YooEditor,
    options?: Partial<TableOfContentsElementProps>,
  ) => TableOfContentsElement;
  insertTableOfContents: (
    editor: YooEditor,
    options?: Partial<TableOfContentsInsertOptions>,
  ) => void;
  deleteTableOfContents: (editor: YooEditor, blockId: string) => void;
  updateTableOfContents: (
    editor: YooEditor,
    blockId: string,
    props: Partial<TableOfContentsElementProps>,
  ) => void;
};

export const TableOfContentsCommands: TableOfContentsCommands = {
  buildTableOfContentsElements: (editor, options = {}) => ({
    id: generateId(),
    type: 'table-of-contents',
    children: [{ text: '' }],
    props: {
      nodeType: 'void',
      depth: options.depth ?? 3,
      title: options.title ?? 'Table of Contents',
      headingTypes: options.headingTypes ?? [...DEFAULT_HEADING_TYPES],
      showNumbers: options.showNumbers ?? false,
      collapsible: options.collapsible ?? false,
    },
  }),
  insertTableOfContents: (editor, options = {}) => {
    const { at, focus, ...props } = options;
    const element = TableOfContentsCommands.buildTableOfContentsElements(
      editor,
      props,
    );
    const block = buildBlockData({
      value: [element],
      type: 'TableOfContents',
    });
    Blocks.insertBlock(editor, block.type, { at, focus, blockData: block });
  },
  deleteTableOfContents: (editor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
  updateTableOfContents: (editor, blockId, props) => {
    Elements.updateElement(editor, {
      blockId,
      type: 'table-of-contents',
      props,
    });
  },
};
