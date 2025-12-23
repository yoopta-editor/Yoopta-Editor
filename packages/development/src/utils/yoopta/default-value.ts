import { YooptaContentValue } from '@yoopta/editor';

export const DEFAULT_VALUE = {
  '1367eae6-3492-4929-9e3a-ce782c7129b7': {
    id: '1367eae6-3492-4929-9e3a-ce782c7129b7',
    type: 'Tabs',
    value: [
      {
        id: 'c960a8d8-16ff-4a96-a0e9-b4069a5d178b',
        type: 'tabs-container',
        props: {
          activeTabId: 'c35debfe-62b2-4221-b1a8-547914d42d76',
          nodeType: 'block',
        },
        children: [
          {
            id: '6524ffdd-6ced-4120-b15e-30b2bb111d2b',
            type: 'tabs-list',
            children: [
              {
                id: '0a6c330e-318d-4a8c-9da4-ab92687aee4e',
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
                id: 'c35debfe-62b2-4221-b1a8-547914d42d76',
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
                id: '4125e499-3f2e-4334-8c90-ad261e76b845',
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
            id: '441bf6fc-7f06-4eb2-8ed0-9addc2238f40',
            type: 'tabs-item-content',
            children: [
              {
                text: 'Tab 1 content',
              },
            ],
            props: {
              nodeType: 'block',
              referenceId: '0a6c330e-318d-4a8c-9da4-ab92687aee4e',
            },
          },
          {
            id: 'c27107c4-f071-42ff-ac1d-a072eca4458a',
            type: 'tabs-item-content',
            children: [
              {
                text: 'Tab 2 content',
              },
            ],
            props: {
              nodeType: 'block',
              referenceId: 'c35debfe-62b2-4221-b1a8-547914d42d76',
            },
          },
          {
            id: '3a36a903-e848-4172-8269-e680b50d0179',
            type: 'tabs-item-content',
            children: [
              {
                text: 'Tab 3 content',
              },
            ],
            props: {
              nodeType: 'block',
              referenceId: '4125e499-3f2e-4334-8c90-ad261e76b845',
            },
          },
        ],
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 0,
    },
  },
} as unknown as YooptaContentValue;
