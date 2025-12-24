import { YooptaContentValue } from '@yoopta/editor';

export const DEFAULT_VALUE = {
  '4f5dd1e9-c720-469d-9e83-a306963e500b': {
    id: '4f5dd1e9-c720-469d-9e83-a306963e500b',
    type: 'Tabs',
    value: [
      {
        id: '46cec593-e554-4951-93f0-83600c506fe7',
        type: 'tabs-container',
        children: [
          {
            id: '36227225-0252-48c7-9090-f2b724e439e0',
            type: 'tabs-list',
            children: [
              {
                id: 'tab-1',
                type: 'tabs-item-heading',
                children: [
                  {
                    text: 'Tab 1',
                  },
                ],
                props: {
                  nodeType: 'block',
                },
              },
              {
                id: 'tab-2',
                type: 'tabs-item-heading',
                children: [
                  {
                    text: 'Tab 2',
                  },
                ],
                props: {
                  nodeType: 'block',
                },
              },
              {
                id: 'tab-3',
                type: 'tabs-item-heading',
                children: [
                  {
                    text: 'Tab 3',
                  },
                ],
                props: {
                  nodeType: 'block',
                },
              },
            ],
            props: {
              nodeType: 'block',
            },
          },
          {
            id: '08796bd7-f9bd-409c-ab4b-61fb6fff6c1e',
            type: 'tabs-item-content',
            children: [
              {
                text: 'Tab 1 content',
              },
            ],
            props: {
              referenceId: 'tab-1',
              nodeType: 'block',
            },
          },
          {
            id: 'e24ec7f6-989c-42e4-9ca7-3337aeb16112',
            type: 'tabs-item-content',
            children: [
              {
                text: 'Tab 2 content',
              },
            ],
            props: {
              referenceId: 'tab-2',
              nodeType: 'block',
            },
          },
          {
            id: '06737da3-4be8-4afe-9d69-0c6dc234cf71',
            type: 'tabs-item-content',
            children: [
              {
                text: 'Tab 3 content',
              },
            ],
            props: {
              referenceId: 'tab-3',
              nodeType: 'block',
            },
          },
        ],
        props: {
          activeTabId: 'tab-1',
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 0,
    },
  },
  '69454127-de2a-41d2-9598-cf34838aad2b': {
    id: '69454127-de2a-41d2-9598-cf34838aad2b',
    type: 'Paragraph',
    value: [
      {
        id: '06410f4b-af8c-46fe-bd81-1a177a896a79',
        type: 'paragraph',
        children: [
          {
            text: '',
          },
        ],
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 1,
    },
  },
  'df9b8fc4-0ca2-4ea8-b113-feb865a16920': {
    id: 'df9b8fc4-0ca2-4ea8-b113-feb865a16920',
    type: 'CodeGroup',
    meta: {
      depth: 0,
      order: 2,
    },
    value: [
      {
        id: '76369809-c9f4-4d57-af18-27d9d554eb00',
        type: 'code-group-container',
        children: [
          {
            id: '98f58853-8918-4b5e-85d0-a0533e430749',
            type: 'code-group-list',
            children: [
              {
                id: '2762fa22-d9ab-4b7e-b745-1da62856319e',
                type: 'code-group-item-heading',
                children: [
                  {
                    text: 'plugins.ts',
                  },
                ],
                props: {
                  nodeType: 'block',
                },
              },
            ],
            props: {
              nodeType: 'block',
            },
          },
          {
            id: 'a596f346-24a0-44f0-8e8c-d46698899a42',
            type: 'code-group-content',
            children: [
              {
                text: '',
              },
            ],
            props: {
              referenceId: '2762fa22-d9ab-4b7e-b745-1da62856319e',
              language: 'typescript',
              theme: 'github-dark',
              nodeType: 'block',
            },
          },
        ],
        props: {
          activeTabId: '2762fa22-d9ab-4b7e-b745-1da62856319e',
          nodeType: 'block',
        },
      },
    ],
  },
} as unknown as YooptaContentValue;
