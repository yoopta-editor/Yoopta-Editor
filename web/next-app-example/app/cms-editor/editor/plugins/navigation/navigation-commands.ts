import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, buildBlockData } from '@yoopta/editor';

import type { NavigationElement } from './types';

type InsertNavigationOptions = {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type NavigationCommands = {
  buildNavigationElements: (editor: YooEditor) => NavigationElement;
  insertNavigation: (editor: YooEditor, options?: Partial<InsertNavigationOptions>) => void;
  deleteNavigation: (editor: YooEditor, blockId: string) => void;
};

export const NavigationCommands: NavigationCommands = {
  buildNavigationElements: (editor: YooEditor) => {
    const nav = editor.y('navigation', {
      props: {
        layout: 'standard',
        position: 'sticky',
        backgroundColor: '#ffffff',
        transparent: false,
        borderBottom: true,
        paddingX: '24px',
        height: '64px',
      },
      children: [
        editor.y('nav-logo', {
          props: { color: '#111827', fontSize: '1.25rem', fontWeight: '700' },
          children: [editor.y.text('YourBrand')],
        }),
        editor.y('nav-links', {
          children: [
            editor.y('nav-link', {
              props: { url: '#features', color: '#4b5563' },
              children: [editor.y.text('Features')],
            }),
            editor.y('nav-link', {
              props: { url: '#pricing', color: '#4b5563' },
              children: [editor.y.text('Pricing')],
            }),
            editor.y('nav-link', {
              props: { url: '#about', color: '#4b5563' },
              children: [editor.y.text('About')],
            }),
            editor.y('nav-link', {
              props: { url: '#docs', color: '#4b5563' },
              children: [editor.y.text('Docs')],
            }),
          ],
        }),
        editor.y('nav-cta', {
          props: { url: '#signup', buttonColor: '#3b82f6', buttonTextColor: '#ffffff', borderRadius: '8px' },
          children: [editor.y.text('Get Started')],
        }),
      ],
    });

    return nav as NavigationElement;
  },

  insertNavigation: (editor: YooEditor, options = {}) => {
    const { at, focus } = options;
    const nav = NavigationCommands.buildNavigationElements(editor);
    const block = buildBlockData({ value: [nav], type: 'Navigation' });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },

  deleteNavigation: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};
