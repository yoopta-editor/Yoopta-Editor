import { YooptaContentValue } from '@yoopta/editor';

export const DEFAULT_VALUE = {
  '04d3baa9-fb03-4a57-812b-e744ea0a44c8': {
    id: '04d3baa9-fb03-4a57-812b-e744ea0a44c8',
    type: 'Steps',
    meta: {
      depth: 0,
      order: 0,
    },
    value: [
      {
        id: 'c306b865-82a4-4c1f-bc10-4091b7e149a1',
        type: 'step-container',
        children: [
          {
            id: '7832a0de-c543-4b6c-bd43-1afed8fa0f5c',
            type: 'step-list',
            children: [
              {
                id: '4f52bf25-19f1-4c49-9559-fe7c98bf0e27',
                type: 'step-list-item',
                children: [
                  {
                    id: '3585cba3-df40-4de8-89f1-3aef54bb5683',
                    type: 'step-list-item-heading',
                    children: [
                      {
                        text: 'Step 1',
                      },
                    ],
                    props: {
                      nodeType: 'block',
                    },
                  },
                  {
                    id: '6b9dc747-4bc3-47c2-b662-cb4d094db293',
                    type: 'step-list-item-content',
                    children: [
                      {
                        text: 'Step 1 content',
                      },
                    ],
                    props: {
                      nodeType: 'block',
                    },
                  },
                ],
                props: {
                  nodeType: 'block',
                  order: 0,
                },
              },
              {
                id: '98365506-1dfa-4f00-ba73-182ba35c387c',
                type: 'step-list-item',
                children: [
                  {
                    id: '5c74a883-97f1-4b5e-b048-d94a52b6515a',
                    type: 'step-list-item-heading',
                    children: [
                      {
                        text: 'Step 2',
                      },
                    ],
                    props: {
                      nodeType: 'block',
                    },
                  },
                  {
                    id: '51126153-1d22-4634-97e9-dafa5ce41a02',
                    type: 'step-list-item-content',
                    children: [
                      {
                        text: 'Step 2 content',
                      },
                    ],
                    props: {
                      nodeType: 'block',
                    },
                  },
                ],
                props: {
                  nodeType: 'block',
                  order: 1,
                },
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
    ],
  },
} as unknown as YooptaContentValue;
