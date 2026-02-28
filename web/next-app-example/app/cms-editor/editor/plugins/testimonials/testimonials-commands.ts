import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, buildBlockData } from '@yoopta/editor';

import type { TestimonialsElement } from './types';

type InsertTestimonialsOptions = {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type TestimonialsCommands = {
  buildTestimonialsElements: (editor: YooEditor) => TestimonialsElement;
  insertTestimonials: (editor: YooEditor, options?: Partial<InsertTestimonialsOptions>) => void;
  deleteTestimonials: (editor: YooEditor, blockId: string) => void;
};

const DEFAULT_TESTIMONIALS = [
  {
    quote: 'This product completely transformed how our team works. The intuitive interface and powerful features made onboarding a breeze.',
    author: 'Sarah Chen',
    role: 'VP of Engineering, TechCorp',
    avatar: '',
  },
  {
    quote: "We've tried many solutions, but nothing comes close to the flexibility and performance we get here. Highly recommend.",
    author: 'Marcus Johnson',
    role: 'CTO, StartupXYZ',
    avatar: '',
  },
  {
    quote: 'The support team is incredible and the product just keeps getting better. It has become an essential part of our workflow.',
    author: 'Emily Park',
    role: 'Product Manager, DesignCo',
    avatar: '',
  },
];

export const TestimonialsCommands: TestimonialsCommands = {
  buildTestimonialsElements: (editor: YooEditor) => {
    const cards = DEFAULT_TESTIMONIALS.map((t) =>
      editor.y('testimonial-card', {
        props: { avatar: t.avatar, rating: 5, accentColor: '#3b82f6' },
        children: [
          editor.y('testimonial-quote', {
            props: { color: '#374151' },
            children: [editor.y.text(t.quote)],
          }),
          editor.y('testimonial-author', {
            props: { color: '#111827' },
            children: [editor.y.text(t.author)],
          }),
          editor.y('testimonial-role', {
            props: { color: '#6b7280' },
            children: [editor.y.text(t.role)],
          }),
        ],
      }),
    );

    return editor.y('testimonials', {
      props: {
        columns: 3,
        variant: 'cards',
        paddingY: 'lg',
        backgroundColor: '#ffffff',
      },
      children: [
        editor.y('testimonials-heading', {
          props: { color: '#111827' },
          children: [editor.y.text('What our customers say')],
        }),
        editor.y('testimonials-description', {
          props: { color: '#6b7280' },
          children: [editor.y.text('Trusted by thousands of teams worldwide')],
        }),
        ...cards,
      ],
    }) as TestimonialsElement;
  },

  insertTestimonials: (editor: YooEditor, options = {}) => {
    const { at, focus } = options;
    const testimonials = TestimonialsCommands.buildTestimonialsElements(editor);
    const block = buildBlockData({ value: [testimonials], type: 'Testimonials' });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },

  deleteTestimonials: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};
