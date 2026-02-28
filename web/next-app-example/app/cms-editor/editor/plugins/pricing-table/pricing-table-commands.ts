import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, buildBlockData } from '@yoopta/editor';

import type { PricingTableElement } from './types';

type InsertPricingTableOptions = {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type PricingTableCommands = {
  buildPricingTableElements: (editor: YooEditor) => PricingTableElement;
  insertPricingTable: (editor: YooEditor, options?: Partial<InsertPricingTableOptions>) => void;
  deletePricingTable: (editor: YooEditor, blockId: string) => void;
};

const TIERS = [
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    featured: false,
    features: [
      { text: 'Up to 5 projects', included: true },
      { text: '1 GB storage', included: true },
      { text: 'Community support', included: true },
      { text: 'Analytics', included: false },
      { text: 'Custom domain', included: false },
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    featured: true,
    features: [
      { text: 'Unlimited projects', included: true },
      { text: '50 GB storage', included: true },
      { text: 'Priority support', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Custom domain', included: true },
    ],
    buttonText: 'Start Free Trial',
    buttonVariant: 'primary' as const,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    featured: false,
    features: [
      { text: 'Unlimited everything', included: true },
      { text: '500 GB storage', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Custom analytics', included: true },
      { text: 'SSO & audit logs', included: true },
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const,
  },
];

export const PricingTableCommands: PricingTableCommands = {
  buildPricingTableElements: (editor: YooEditor) => {
    const tiers = TIERS.map((tier) => {
      const features = tier.features.map((f) =>
        editor.y('pricing-tier-feature', {
          props: { color: '#4b5563', included: f.included },
          children: [editor.y.text(f.text)],
        }),
      );

      return editor.y('pricing-tier', {
        props: {
          featured: tier.featured,
          accentColor: '#3b82f6',
          backgroundColor: tier.featured ? '#f0f7ff' : '#ffffff',
        },
        children: [
          editor.y('pricing-tier-name', {
            props: { color: '#111827' },
            children: [editor.y.text(tier.name)],
          }),
          editor.y('pricing-tier-price', {
            props: { color: '#111827' },
            children: [editor.y.text(tier.price)],
          }),
          editor.y('pricing-tier-period', {
            props: { color: '#6b7280' },
            children: [editor.y.text(tier.period)],
          }),
          ...features,
          editor.y('pricing-tier-button', {
            props: {
              url: '#',
              variant: tier.buttonVariant,
              buttonColor: '#3b82f6',
              buttonTextColor: tier.buttonVariant === 'primary' ? '#ffffff' : '#3b82f6',
              borderRadius: '8px',
            },
            children: [editor.y.text(tier.buttonText)],
          }),
        ],
      });
    });

    return editor.y('pricing-table', {
      props: {
        columns: 3,
        variant: 'cards',
        paddingY: 'lg',
        backgroundColor: '#ffffff',
      },
      children: [
        editor.y('pricing-heading', {
          props: { color: '#111827' },
          children: [editor.y.text('Simple, transparent pricing')],
        }),
        editor.y('pricing-description', {
          props: { color: '#6b7280' },
          children: [editor.y.text('Choose the plan that works best for your team')],
        }),
        ...tiers,
      ],
    }) as PricingTableElement;
  },

  insertPricingTable: (editor: YooEditor, options = {}) => {
    const { at, focus } = options;
    const pricing = PricingTableCommands.buildPricingTableElements(editor);
    const block = buildBlockData({ value: [pricing], type: 'PricingTable' });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },

  deletePricingTable: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};
