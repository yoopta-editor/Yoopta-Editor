import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, buildBlockData } from '@yoopta/editor';

import type { FAQElement } from './types';

type InsertFAQOptions = {
  at?: YooptaPathIndex;
  focus?: boolean;
};

const faqDefaultProps = {
  variant: 'default' as const,
  paddingY: 'lg' as const,
  backgroundColor: '#ffffff',
  iconStyle: 'plus' as const,
};

const headingDefaultProps = { color: '#111827' };
const descriptionDefaultProps = { color: '#6b7280' };
const itemDefaultProps = { isExpanded: false, borderColor: '#e5e7eb' };
const questionDefaultProps = { color: '#111827' };
const answerDefaultProps = { color: '#4b5563' };

const DEFAULT_FAQ_ITEMS = [
  {
    question: 'How do I get started?',
    answer: 'Sign up for a free account and follow our quick start guide to begin building in minutes.',
  },
  {
    question: 'Is there a free plan available?',
    answer: 'Yes, we offer a generous free tier that includes all core features for small teams.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Absolutely. You can cancel your subscription at any time with no hidden fees or penalties.',
  },
];

export type FAQCommands = {
  buildFAQElements: (editor: YooEditor) => FAQElement;
  insertFAQ: (editor: YooEditor, options?: Partial<InsertFAQOptions>) => void;
  deleteFAQ: (editor: YooEditor, blockId: string) => void;
};

export const FAQCommands: FAQCommands = {
  buildFAQElements: (editor: YooEditor) => {
    const items = DEFAULT_FAQ_ITEMS.map((item) =>
      editor.y('faq-item', {
        props: itemDefaultProps,
        children: [
          editor.y('faq-item-question', {
            props: questionDefaultProps,
            children: [editor.y.text(item.question)],
          }),
          editor.y('faq-item-answer', {
            props: answerDefaultProps,
            children: [editor.y.text(item.answer)],
          }),
        ],
      }),
    );

    return editor.y('faq', {
      props: faqDefaultProps,
      children: [
        editor.y('faq-heading', {
          props: headingDefaultProps,
          children: [editor.y.text('Frequently Asked Questions')],
        }),
        editor.y('faq-description', {
          props: descriptionDefaultProps,
          children: [editor.y.text('Find answers to common questions about our platform')],
        }),
        ...items,
      ],
    }) as FAQElement;
  },

  insertFAQ: (editor: YooEditor, options = {}) => {
    const { at, focus } = options;
    const faq = FAQCommands.buildFAQElements(editor);
    const block = buildBlockData({ value: [faq], type: 'FAQ' });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },

  deleteFAQ: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};
