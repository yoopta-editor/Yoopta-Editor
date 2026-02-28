import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, buildBlockData } from '@yoopta/editor';

import type { CTABannerElement } from './types';

type InsertCTABannerOptions = {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type CTABannerCommands = {
  buildCTABannerElements: (editor: YooEditor) => CTABannerElement;
  insertCTABanner: (editor: YooEditor, options?: Partial<InsertCTABannerOptions>) => void;
  deleteCTABanner: (editor: YooEditor, blockId: string) => void;
};

export const CTABannerCommands: CTABannerCommands = {
  buildCTABannerElements: (editor: YooEditor) => {
    const heading = editor.y('cta-heading', {
      props: { color: '#ffffff', fontSize: '3xl' },
      children: [editor.y.text('Ready to get started?')],
    });

    const description = editor.y('cta-description', {
      props: { color: '#e2e8f0' },
      children: [editor.y.text('Join thousands of teams already using our platform to build better products.')],
    });

    const buttons = editor.y('cta-buttons', {
      children: [
        editor.y('cta-button', {
          props: {
            url: '#signup',
            variant: 'primary',
            buttonColor: '#ffffff',
            buttonTextColor: '#1e40af',
            borderRadius: '8px',
          },
          children: [editor.y.text('Start Free Trial')],
        }),
        editor.y('cta-button', {
          props: {
            url: '#contact',
            variant: 'outline',
            buttonColor: '#ffffff',
            buttonTextColor: '#ffffff',
            borderRadius: '8px',
          },
          children: [editor.y.text('Contact Sales')],
        }),
      ],
    });

    return editor.y('cta-banner', {
      props: {
        variant: 'centered',
        backgroundType: 'gradient',
        backgroundColor: '#1e40af',
        gradient: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
        borderRadius: '0px',
        paddingY: 'lg',
        bordered: false,
        borderColor: '#e5e7eb',
      },
      children: [heading, description, buttons],
    }) as CTABannerElement;
  },

  insertCTABanner: (editor: YooEditor, options = {}) => {
    const { at, focus } = options;
    const cta = CTABannerCommands.buildCTABannerElements(editor);
    const block = buildBlockData({ value: [cta], type: 'CTABanner' });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },

  deleteCTABanner: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};
