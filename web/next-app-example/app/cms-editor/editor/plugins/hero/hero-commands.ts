import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, buildBlockData } from '@yoopta/editor';

import type { HeroElement } from './types';

type InsertHeroOptions = {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type HeroCommands = {
  buildHeroElements: (editor: YooEditor) => HeroElement;
  insertHero: (editor: YooEditor, options?: Partial<InsertHeroOptions>) => void;
  deleteHero: (editor: YooEditor, blockId: string) => void;
};

export const HeroCommands: HeroCommands = {
  buildHeroElements: (editor: YooEditor) => {
    const hero = editor.y('hero', {
      props: {
        variant: 'centered',
        backgroundType: 'gradient',
        backgroundColor: '#0f172a',
        gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        backgroundImage: '',
        backgroundEffect: 'glow',
        overlay: false,
        overlayOpacity: 0.5,
        paddingY: 'xl',
        fullHeight: false,
      },
      children: [
        editor.y('hero-badge', {
          props: {
            variant: 'pill',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            textColor: '#93c5fd',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            url: '',
          },
          children: [editor.y.text('Announcing v6.0')],
        }),
        editor.y('hero-title', {
          props: {
            fontSize: '6xl',
            color: '#ffffff',
            gradientText: true,
            textGradient: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
          },
          children: [editor.y.text('Build something amazing')],
        }),
        editor.y('hero-subtitle', {
          props: { fontSize: 'xl', color: '#94a3b8' },
          children: [editor.y.text('Create beautiful websites with the power of Yoopta CMS plugins. Direct editing meets component-based design.')],
        }),
        editor.y('hero-buttons', {
          children: [
            editor.y('hero-button', {
              props: { url: '#', variant: 'primary', size: 'lg', buttonColor: '#3b82f6', buttonTextColor: '#ffffff' },
              children: [editor.y.text('Get Started')],
            }),
            editor.y('hero-button', {
              props: { url: '#', variant: 'outline', size: 'lg', buttonColor: 'rgba(255, 255, 255, 0.3)', buttonTextColor: '#ffffff' },
              children: [editor.y.text('Learn More')],
            }),
          ],
        }),
      ],
    });

    return hero as HeroElement;
  },

  insertHero: (editor: YooEditor, options = {}) => {
    const { at, focus } = options;
    const hero = HeroCommands.buildHeroElements(editor);
    const block = buildBlockData({ value: [hero], type: 'Hero' });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },

  deleteHero: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};
