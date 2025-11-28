import { YooptaContentValue } from '@yoopta/editor';

export const DEFAULT_VALUE = {
  'ccf07889-23a3-44f3-9b9d-2270b149fb26': {
    id: 'ccf07889-23a3-44f3-9b9d-2270b149fb26',
    type: 'Accordion',
    meta: {
      depth: 0,
      order: 0,
    },
    value: [
      {
        id: '28c6ec04-3d86-4d68-b0a9-2e9835d2d852',
        type: 'accordion-list',
        props: { nodeType: 'block' },
        children: [
          {
            id: '3e3d5c8e-be39-4798-aeb7-57cc00c228dc',
            type: 'accordion-list-item',
            children: [
              {
                id: '6ada1383-74b3-4aef-b80d-6133b47fcb4c',
                type: 'accordion-list-item-heading',
                children: [
                  {
                    text: '',
                  },
                ],
                props: { nodeType: 'block' },
              },
              {
                id: '3b271932-f126-48fd-acd6-5efc8a38e625',
                type: 'accordion-list-item-content',
                children: [
                  {
                    id: '52badbce-e743-4cfa-a860-5f27b9ccbc56',
                    type: 'bulleted-list',
                    props: { nodeType: 'block' },
                    children: [
                      {
                        text: 'Bullet list item inside `accordion-list-item-content`',
                      },
                    ],
                  },
                  {
                    id: '52badbce-e743-4cfa-a860-5f27b9ccbc56',
                    type: 'heading-three',
                    props: { nodeType: 'block' },
                    children: [
                      {
                        text: 'Heading three item inside `accordion-list-item-content`',
                      },
                    ],
                  },
                ],
                props: { nodeType: 'block' },
              },
            ],
            props: { nodeType: 'block', isExpanded: true },
          },
        ],
      },
    ],
  },
} as unknown as YooptaContentValue;
