import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, buildBlockData } from '@yoopta/editor';

import type { AccordionListElement, AccordionListItemProps } from '../types';

type AccordionElementOptions = {
  items?: number;
  props: AccordionListItemProps;
};

type InsertAccordionOptions = AccordionElementOptions & {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type AccordionCommands = {
  buildAccordionElements: (
    editor: YooEditor,
    options?: Partial<AccordionElementOptions>,
  ) => AccordionListElement;
  insertAccordion: (editor: YooEditor, options?: Partial<InsertAccordionOptions>) => void;
  deleteAccordion: (editor: YooEditor, blockId: string) => void;
};

export const AccordionCommands: AccordionCommands = {
  buildAccordionElements: (editor: YooEditor, options = {}) => {
    const accordionList = editor.y('accordion-list');
    const { items = 1, props: { isExpanded = false } = {} } = options;

    for (let i = 0; i < items; i += 1) {
      const accordionListItem = editor.y('accordion-list-item', {
        props: { isExpanded },
        children: [
          editor.y('accordion-list-item-heading'),
          editor.y('accordion-list-item-content'),
        ],
      });

      if (!accordionList.children) accordionList.children = [];
      accordionList.children.push(accordionListItem);
    }

    return accordionList as AccordionListElement;
  },
  insertAccordion: (editor: YooEditor, options = {}) => {
    const { at, focus, props, items } = options;
    const accordionList = AccordionCommands.buildAccordionElements(editor, { props, items });
    const block = buildBlockData({ value: [accordionList], type: 'Accordion' });
    // [TEST]
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },
  deleteAccordion: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};
