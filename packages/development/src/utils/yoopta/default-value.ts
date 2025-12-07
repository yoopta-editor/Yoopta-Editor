import { YooptaContentValue } from '@yoopta/editor';

export const DEFAULT_VALUE = {
  id: 'c66758a8-50eb-435c-a505-7d9ee5bb4c66',
  type: 'Steps',
  meta: {
    depth: 0,
    order: 0,
  },
  value: [
    {
      id: '8593785d-e3e2-4f9d-80b5-399de7d017dd',
      type: 'step-container',
      props: {
        nodeType: 'block',
      },
      children: [
        {
          id: 'e267838d-ff4f-4e21-bdcb-b8c5f19895f9',
          type: 'step-list',
          children: [
            {
              id: '91c3de26-212d-4783-a3fc-2cd813dd00c5',
              type: 'step-list-item',
              children: [
                {
                  id: 'dd59ac85-57b7-42ef-8e47-a2601a3323b7',
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
                  id: '5969435f-fe21-4717-8143-4e5dd1eb8bee',
                  type: 'step-list-item-content',
                  children: [
                    {
                      text: '',
                    },
                  ],
                  props: {
                    nodeType: 'block',
                  },
                },
              ],
              props: {
                nodeType: 'block',
                isCompleted: false,
              },
            },
            {
              id: 'ee380e50-4371-4190-b298-4270d6bdc48d',
              type: 'step-list-item',
              children: [
                {
                  id: '4fcf037a-1b37-49e4-8f1d-ef907c018275',
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
                  id: '62ecb774-a03b-4aa1-ab8a-2ded86f17f5d',
                  type: 'step-list-item-content',
                  children: [
                    {
                      text: '',
                    },
                  ],
                  props: {
                    nodeType: 'block',
                  },
                },
              ],
              props: {
                nodeType: 'block',
                isCompleted: false,
              },
            },
          ],
          props: {
            nodeType: 'block',
          },
        },
      ],
    },
  ],
} as unknown as YooptaContentValue;
