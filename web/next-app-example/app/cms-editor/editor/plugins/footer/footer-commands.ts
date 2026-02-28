import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, buildBlockData } from '@yoopta/editor';

import type { FooterElement } from './types';

type InsertFooterOptions = {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type FooterCommands = {
  buildFooterElements: (editor: YooEditor) => FooterElement;
  insertFooter: (editor: YooEditor, options?: Partial<InsertFooterOptions>) => void;
  deleteFooter: (editor: YooEditor, blockId: string) => void;
};

export const FooterCommands: FooterCommands = {
  buildFooterElements: (editor: YooEditor) => {
    const brand = editor.y('footer-brand', {
      props: { color: '#111827', fontSize: '1.25rem' },
      children: [editor.y.text('YourBrand')],
    });

    const description = editor.y('footer-description', {
      props: { color: '#6b7280' },
      children: [editor.y.text('Building the future of content editing. Simple, powerful, and extensible.')],
    });

    const columns = [
      {
        title: 'Product',
        links: [
          { text: 'Features', url: '#features' },
          { text: 'Pricing', url: '#pricing' },
          { text: 'Docs', url: '#docs' },
          { text: 'Changelog', url: '#changelog' },
        ],
      },
      {
        title: 'Company',
        links: [
          { text: 'About', url: '#about' },
          { text: 'Blog', url: '#blog' },
          { text: 'Careers', url: '#careers' },
          { text: 'Contact', url: '#contact' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { text: 'Privacy', url: '#privacy' },
          { text: 'Terms', url: '#terms' },
        ],
      },
    ].map((col) =>
      editor.y('footer-column', {
        children: [
          editor.y('footer-column-title', {
            props: { color: '#111827' },
            children: [editor.y.text(col.title)],
          }),
          ...col.links.map((link) =>
            editor.y('footer-link', {
              props: { url: link.url, color: '#6b7280' },
              children: [editor.y.text(link.text)],
            }),
          ),
        ],
      }),
    );

    const copyright = editor.y('footer-copyright', {
      props: { color: '#9ca3af' },
      children: [editor.y.text(`© ${new Date().getFullYear()} YourBrand. All rights reserved.`)],
    });

    return editor.y('footer', {
      props: {
        layout: 'simple',
        backgroundColor: '#ffffff',
        paddingY: 'lg',
        borderTop: true,
        borderColor: '#e5e7eb',
      },
      children: [brand, description, ...columns, copyright],
    }) as FooterElement;
  },

  insertFooter: (editor: YooEditor, options = {}) => {
    const { at, focus } = options;
    const footer = FooterCommands.buildFooterElements(editor);
    const block = buildBlockData({ value: [footer], type: 'Footer' });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },

  deleteFooter: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};
