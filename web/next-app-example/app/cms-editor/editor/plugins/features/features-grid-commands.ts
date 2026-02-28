import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, buildBlockData } from '@yoopta/editor';

import type { FeaturesGridElement } from './types';

type InsertFeaturesGridOptions = {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type FeaturesGridCommands = {
  buildFeaturesGridElements: (editor: YooEditor) => FeaturesGridElement;
  insertFeaturesGrid: (editor: YooEditor, options?: Partial<InsertFeaturesGridOptions>) => void;
  deleteFeaturesGrid: (editor: YooEditor, blockId: string) => void;
};

const DEFAULT_FEATURES = [
  { icon: '⚡', title: 'Lightning Fast', description: 'Built for speed with optimized rendering and minimal bundle size.' },
  { icon: '🎨', title: 'Fully Customizable', description: 'Every component can be styled and configured to match your brand.' },
  { icon: '🔌', title: 'Plugin System', description: 'Extend functionality with a powerful and flexible plugin architecture.' },
];

export const FeaturesGridCommands: FeaturesGridCommands = {
  buildFeaturesGridElements: (editor: YooEditor) => {
    const cards = DEFAULT_FEATURES.map((feature) =>
      editor.y('feature-card', {
        props: { icon: feature.icon, iconColor: '#3b82f6' },
        children: [
          editor.y('feature-card-title', {
            props: { color: '#111827' },
            children: [editor.y.text(feature.title)],
          }),
          editor.y('feature-card-description', {
            props: { color: '#6b7280' },
            children: [editor.y.text(feature.description)],
          }),
        ],
      }),
    );

    const grid = editor.y('features-grid', {
      props: {
        columns: 3,
        variant: 'cards',
        paddingY: 'lg',
        backgroundColor: '#ffffff',
        showIcons: true,
      },
      children: [
        editor.y('features-heading', {
          props: { color: '#111827' },
          children: [editor.y.text('Features')],
        }),
        editor.y('features-description', {
          props: { color: '#6b7280' },
          children: [editor.y.text('Everything you need to build modern websites')],
        }),
        ...cards,
      ],
    });

    return grid as FeaturesGridElement;
  },

  insertFeaturesGrid: (editor: YooEditor, options = {}) => {
    const { at, focus } = options;
    const grid = FeaturesGridCommands.buildFeaturesGridElements(editor);
    const block = buildBlockData({ value: [grid], type: 'FeaturesGrid' });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },

  deleteFeaturesGrid: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};
