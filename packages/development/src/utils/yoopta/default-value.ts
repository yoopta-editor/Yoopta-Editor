import { YooptaContentValue } from '@yoopta/editor';

export const DEFAULT_VALUE = {
  '7709c143-00f7-4c9e-8dbc-71768e8c3042': {
    id: '7709c143-00f7-4c9e-8dbc-71768e8c3042',
    type: 'Steps',
    meta: {
      depth: 0,
      order: 0,
    },
    value: [
      {
        id: 'aec50233-8a66-4686-8404-6a94966f0212',
        type: 'step-container',
        children: [
          {
            id: '3809d2f7-23de-4914-98e3-678b5f60155f',
            type: 'step-list',
            children: [
              {
                id: 'b03c2ccd-cc04-4580-8676-84008fe72d81',
                type: 'step-list-item',
                children: [
                  {
                    id: 'eedd0090-725f-459b-badd-7ca1ae078cba',
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
                    id: 'a790dec5-5fc7-4cd9-b856-db8d3c67c670',
                    type: 'step-list-item-content',
                    children: [
                      {
                        id: '43d94fa6-a740-44d4-ac26-e7f4268f1ac4',
                        type: 'heading-two',
                        children: [
                          {
                            text: 'adadasdasd',
                          },
                        ],
                        props: {
                          withAnchor: false,
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
                  order: 0,
                },
              },
              {
                id: 'e69948c0-6824-4066-a91f-6aca3ec758a1',
                type: 'step-list-item',
                children: [
                  {
                    id: 'c384a78c-2f59-43aa-8e33-49f090b91c65',
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
                    id: '46761f01-e676-41e6-8b80-e4769a26014d',
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
