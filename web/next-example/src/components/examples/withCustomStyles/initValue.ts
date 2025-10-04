export const WITH_CUSTOM_STYLES_VALUE = {
  '8d11f1e5-2e26-4cc9-ba5f-7e46982c544e': {
    id: '8d11f1e5-2e26-4cc9-ba5f-7e46982c544e',
    value: [
      {
        id: '0f626d0d-c33b-453e-af65-d28203a09d71',
        type: 'heading-one',
        children: [
          {
            text: 'With custom styles example',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'HeadingOne',
    meta: {
      order: 0,
      depth: 0,
    },
  },
  'abb53e3d-f0bd-482d-af93-342f02408381': {
    id: 'abb53e3d-f0bd-482d-af93-342f02408381',
    type: 'Callout',
    meta: {
      order: 1,
      depth: 0,
    },
    value: [
      {
        id: 'cdf369a1-7ea6-47cc-87aa-f1064d39b193',
        type: 'callout',
        children: [
          {
            text: 'This example will show you how you can extend existing styles or add your own',
          },
        ],
        props: {
          nodeType: 'block',
          theme: 'info',
        },
      },
    ],
  },
  '426b5175-2054-44c0-9394-6e349f9c523a': {
    id: '426b5175-2054-44c0-9394-6e349f9c523a',
    value: [
      {
        id: 'b3bd9566-dfa6-4bca-a9f2-03ba496dd592',
        type: 'paragraph',
        children: [
          {
            text: 'By default Yoopta provide some default styles for each plugin\nBut you can ',
          },
          {
            text: 'extend',
            underline: true,
          },
          {
            text: ' them by adding your ',
          },
          {
            text: 'className ',
            bold: true,
          },
          {
            text: 'or ',
          },
          {
            text: 'style',
            bold: true,
          },
          {
            text: ' object',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'Paragraph',
    meta: {
      order: 2,
      depth: 0,
    },
  },
  'ff0ecfa6-0d1c-4e23-8f35-fef66cef499d': {
    id: 'ff0ecfa6-0d1c-4e23-8f35-fef66cef499d',
    value: [
      {
        id: 'c6c06b56-a0c2-4194-a8a7-53435ce8d79b',
        type: 'code',
        children: [
          {
            text: "import Blockquote from '@yoopta/blockquote'\n\nconst plugins = [\n  //...otherplugins\n  Blockquote.extend({\n    options: {\n      HTMLAttributes: {\n        className: s.blockquote,\n      },\n    },\n  })\n]",
          },
        ],
        props: {
          nodeType: 'void',
          language: 'javascript',
          theme: 'VSCode',
        },
      },
    ],
    type: 'Code',
    meta: {
      order: 5,
      depth: 1,
    },
  },
  'ef58df3e-c56a-4ca7-b2a0-3e9243a6bc8c': {
    id: 'ef58df3e-c56a-4ca7-b2a0-3e9243a6bc8c',
    value: [
      {
        id: '6727a30f-96fd-4a6e-b143-923e65231e18',
        type: 'blockquote',
        children: [
          {
            text: 'And now you can see applied styles for Blockquote',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'Blockquote',
    meta: {
      order: 6,
      depth: 1,
    },
  },
  '1df8b0fd-290b-4c36-bbe6-31ec6c745a3d': {
    id: '1df8b0fd-290b-4c36-bbe6-31ec6c745a3d',
    type: 'HeadingThree',
    meta: {
      order: 3,
      depth: 0,
    },
    value: [
      {
        id: 'b3bd9566-dfa6-4bca-a9f2-03ba496dd592',
        type: 'heading-three',
        props: {
          nodeType: 'block',
        },
        children: [
          {
            text: 'Example with ',
          },
          {
            text: '.extend',
            underline: true,
          },
          {
            text: ': ',
          },
        ],
      },
    ],
  },
  'b3b9b33d-643e-4326-89f6-262777fe7163': {
    id: 'b3b9b33d-643e-4326-89f6-262777fe7163',
    value: [
      {
        id: '249125f0-8a2c-4d8d-8b3d-a2a6570deaa0',
        type: 'numbered-list',
        children: [
          {
            text: 'Using your own ',
          },
          {
            text: 'classname',
            underline: true,
          },
          {
            text: ' ',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'NumberedList',
    meta: {
      order: 4,
      depth: 0,
    },
  },
  'fb766838-54a3-4979-b05b-d530e434e40c': {
    id: 'fb766838-54a3-4979-b05b-d530e434e40c',
    value: [
      {
        id: 'd7cce324-38ed-4657-8605-b93206b59a30',
        type: 'paragraph',
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
    type: 'Paragraph',
    meta: {
      order: 11,
      depth: 0,
    },
  },
  '69c3628b-d0dc-4e97-bdad-200ee6a0e3dd': {
    id: '69c3628b-d0dc-4e97-bdad-200ee6a0e3dd',
    value: [
      {
        id: 'df310f44-be9d-4da4-a2a7-2e6ba8dc71cf',
        type: 'paragraph',
        children: [
          {
            text: '2. Using ',
          },
          {
            text: 'style',
            underline: true,
          },
          {
            text: ' object',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'Paragraph',
    meta: {
      order: 8,
      depth: 0,
    },
  },
  'ac34f583-2603-4b35-a23c-85b296687ad1': {
    id: 'ac34f583-2603-4b35-a23c-85b296687ad1',
    type: 'HeadingTwo',
    meta: {
      order: 10,
      depth: 1,
    },
    value: [
      {
        id: '0d949735-7bee-432e-9485-8443273f608a',
        type: 'heading-two',
        children: [
          {
            text: "I'm Heading two and it works!",
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
  },
  '1c9df015-11b3-4cd1-831f-66f5b4111d57': {
    id: '1c9df015-11b3-4cd1-831f-66f5b4111d57',
    value: [
      {
        id: '7cc8b180-5920-4e57-9c46-cee26bef206a',
        type: 'code',
        children: [
          {
            text: "import Blockquote from '@yoopta/blockquote'\nimport { HeadingTwo } from '@yoopta/headings';\n\nconst plugins = [\n  //...otherplugins\n  Blockquote.extend({\n    options: {\n      HTMLAttributes: {\n        className: s.blockquote,\n      },\n    },\n  }),\n  HeadingTwo.extend({\n    options: {\n      HTMLAttributes: {\n        style: {\n          color: 'green',\n        },\n      },\n    },\n  })\n]",
          },
        ],
        props: {
          nodeType: 'void',
          language: 'javascript',
          theme: 'VSCode',
        },
      },
    ],
    type: 'Code',
    meta: {
      order: 9,
      depth: 1,
    },
  },
  '1a1ce913-6ab1-4487-bfc3-deec5651966a': {
    id: '1a1ce913-6ab1-4487-bfc3-deec5651966a',
    value: [
      {
        id: 'c9c52908-f9df-4018-b867-81b34e1e2998',
        type: 'paragraph',
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
    type: 'Paragraph',
    meta: {
      order: 7,
      depth: 0,
    },
  },
  'dc2f645d-48dc-467c-aae3-086b5913e3a2': {
    id: 'dc2f645d-48dc-467c-aae3-086b5913e3a2',
    value: [
      {
        id: '6ef7dd62-76aa-4fae-9990-b6bc7f81cbf3',
        type: 'heading-three',
        children: [
          {
            text: 'Rewrite default classname in your CSS file',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'HeadingThree',
    meta: {
      order: 12,
      depth: 0,
    },
  },
  '50cba391-eca4-4ed3-a3c3-c94d9dc49ac4': {
    id: '50cba391-eca4-4ed3-a3c3-c94d9dc49ac4',
    value: [
      {
        id: '45aa84fa-ae92-4075-bf57-6f02bab9ceb8',
        type: 'paragraph',
        children: [
          {
            text: 'Yoopta provides default ',
          },
          {
            text: 'classnames',
            underline: true,
          },
          {
            text: " that can be changed in your CSS file.\nLet's list the available classтnames at all levels",
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'Paragraph',
    meta: {
      order: 13,
      depth: 0,
    },
  },
  '776112ab-fa7e-4c99-9dfe-a2db1fee4f52': {
    id: '776112ab-fa7e-4c99-9dfe-a2db1fee4f52',
    value: [
      {
        id: '37833b56-3aa8-4899-bcc4-6309d2bfb714',
        type: 'paragraph',
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
    type: 'Paragraph',
    meta: {
      order: 14,
      depth: 0,
    },
  },
  '7bed329f-883b-47bd-a7b2-e49b5ee04997': {
    id: '7bed329f-883b-47bd-a7b2-e49b5ee04997',
    value: [
      {
        id: 'f247f460-6cb6-4db8-ad1a-1e4040ccd059',
        type: 'bulleted-list',
        children: [
          {
            text: 'Editor level',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 15,
      depth: 0,
    },
  },
  'ef5235b0-b9be-4f58-8bc1-a34b6c69bf88': {
    id: 'ef5235b0-b9be-4f58-8bc1-a34b6c69bf88',
    value: [
      {
        id: '4c908c07-0f49-48c4-84e7-ee42837a8d83',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-editor',
            code: true,
          },
          {
            text: ' - classname for whole editor',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 16,
      depth: 1,
    },
  },
  '822e4e88-356d-4dc0-961b-ebf4cbed23b1': {
    id: '822e4e88-356d-4dc0-961b-ebf4cbed23b1',
    value: [
      {
        id: 'dae0fff1-4726-41e7-9a51-abea40cdc7e2',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-block',
            code: true,
          },
          {
            text: ' - block wrapper',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 17,
      depth: 1,
    },
  },
  'f74ea944-5467-446d-b440-e0e296ca59a3': {
    id: 'f74ea944-5467-446d-b440-e0e296ca59a3',
    value: [
      {
        id: 'fc60b45e-c562-4426-83c1-9d39043f172c',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-block-actions',
            code: true,
          },
          {
            text: ' - block actions ',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 18,
      depth: 1,
    },
  },
  '2388cf19-f334-4d09-827e-c5090ae08536': {
    id: '2388cf19-f334-4d09-827e-c5090ae08536',
    value: [
      {
        id: '658b0daf-dd3e-4497-892c-a4cde7bf6571',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-block-actions-plus',
            code: true,
          },
          {
            text: ' - block plus action button',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 19,
      depth: 2,
    },
  },
  '82e7f168-be9e-4f2b-b6f4-d3089b3d3565': {
    id: '82e7f168-be9e-4f2b-b6f4-d3089b3d3565',
    value: [
      {
        id: 'be4e6e0b-0399-471e-be63-79fa18fb07b1',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-block-actions-drag',
            code: true,
          },
          {
            text: ' - block drag action button',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 20,
      depth: 2,
    },
  },
  '8bc07fd3-24c1-4f51-960a-dc4e2383259d': {
    id: '8bc07fd3-24c1-4f51-960a-dc4e2383259d',
    value: [
      {
        id: 'cc3c3b36-d6ce-40e0-891f-15e1610c1d33',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-block-options-menu-content',
            code: true,
          },
          {
            text: ' - block options',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 21,
      depth: 1,
    },
  },
  'b336f4c7-52fa-4134-89ca-7baa76eb786d': {
    id: 'b336f4c7-52fa-4134-89ca-7baa76eb786d',
    value: [
      {
        id: '97673697-0d94-4c60-8b80-f5b685f079dd',
        type: 'paragraph',
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
    type: 'Paragraph',
    meta: {
      order: 25,
      depth: 0,
    },
  },
  'b46198d9-5f06-4261-b64a-baeff1ec8fa6': {
    id: 'b46198d9-5f06-4261-b64a-baeff1ec8fa6',
    value: [
      {
        id: '3bfb123b-c841-4398-9b5e-907bbdd39808',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-block-options-group',
            code: true,
          },
          {
            text: ' - block options group',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 22,
      depth: 2,
    },
  },
  '1973806c-a8ad-4a72-a49a-1e1f0148cb4e': {
    id: '1973806c-a8ad-4a72-a49a-1e1f0148cb4e',
    value: [
      {
        id: '8b3af73a-8541-41cf-89b3-e75b2de1f81d',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-block-options-button',
            code: true,
          },
          {
            text: ' - block options button',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 23,
      depth: 2,
    },
  },
  '0150ce5e-913b-4f89-a79f-8a7bf1193b1d': {
    id: '0150ce5e-913b-4f89-a79f-8a7bf1193b1d',
    type: 'BulletedList',
    meta: {
      order: 26,
      depth: 0,
    },
    value: [
      {
        id: '70ab6a08-527e-44df-9b03-ccf9951433b5',
        type: 'bulleted-list',
        children: [
          {
            text: 'Each plugin elements',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
  },
  'ebf9b47f-630d-49f3-b358-ce4858e6ca17': {
    id: 'ebf9b47f-630d-49f3-b358-ce4858e6ca17',
    value: [
      {
        id: '224e127a-e907-41e7-a5a8-c8b6fc303be9',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-paragraph',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Paragraph',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 27,
      depth: 1,
    },
  },
  'd56edb9c-005c-4bd7-90e4-adec80300b01': {
    id: 'd56edb9c-005c-4bd7-90e4-adec80300b01',
    value: [
      {
        id: '6063947d-a4e4-4fd2-8937-5756541e3e8e',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-extended-block-actions',
            code: true,
          },
          {
            text: ' - extended block options button',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 24,
      depth: 2,
    },
  },
  'cc66bbb7-44df-4ae9-95ef-d0c2fd8c753a': {
    id: 'cc66bbb7-44df-4ae9-95ef-d0c2fd8c753a',
    value: [
      {
        id: 'f2c58ffe-4a7b-41ed-b82b-49079632d9b5',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-blockquote',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Blockquote',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 28,
      depth: 1,
    },
  },
  '98544bf8-822b-41d5-8888-c1710fca3083': {
    id: '98544bf8-822b-41d5-8888-c1710fca3083',
    value: [
      {
        id: '4e56954b-f1e8-473c-90a9-cd5eb3ba1ea8',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-callout',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Callout',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 29,
      depth: 1,
    },
  },
  'e9f05380-f718-464f-9f86-53abfc6e9ec2': {
    id: 'e9f05380-f718-464f-9f86-53abfc6e9ec2',
    value: [
      {
        id: '5a22824b-3413-471c-8070-59504114570f',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-callout-default',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Callout ',
            bold: true,
          },
          {
            text: 'theme',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 30,
      depth: 2,
    },
  },
  '9c34aad0-bfe8-4f13-9626-9f1edb340192': {
    id: '9c34aad0-bfe8-4f13-9626-9f1edb340192',
    value: [
      {
        id: '521de24a-f0a2-47fd-b5cf-377f7de2825a',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-callout-info',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Callout ',
            bold: true,
          },
          {
            text: 'info',
          },
          {
            bold: true,
            text: ' ',
          },
          {
            text: 'theme',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 31,
      depth: 2,
    },
  },
  'b4587505-5ffd-444f-9bf6-94c5524925c5': {
    id: 'b4587505-5ffd-444f-9bf6-94c5524925c5',
    value: [
      {
        id: 'fffabba0-f0e2-43d7-aff9-35dc7b3897e7',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-callout-success',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Callout',
            bold: true,
          },
          {
            text: ' success theme',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 32,
      depth: 2,
    },
  },
  'bedd9bc5-c200-4c2b-814b-00cd79b66c84': {
    id: 'bedd9bc5-c200-4c2b-814b-00cd79b66c84',
    value: [
      {
        id: 'fffabba0-f0e2-43d7-aff9-35dc7b3897e7',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-callout-error',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Callout',
            bold: true,
          },
          {
            text: ' error theme',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 33,
      depth: 2,
    },
  },
  '92b502e6-493e-4ae1-a31e-77a4580e6ae8': {
    id: '92b502e6-493e-4ae1-a31e-77a4580e6ae8',
    value: [
      {
        id: '09dd9e3f-1e7c-491e-aa07-6db3bfd6b6c4',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-link',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Link',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 34,
      depth: 1,
    },
  },
  'dbf53445-b122-466d-b2ba-8771e5b73be6': {
    id: 'dbf53445-b122-466d-b2ba-8771e5b73be6',
    value: [
      {
        id: '4e4e5eae-9cd2-4b2c-9909-0f81c36b9bc3',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-bulleted-list',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'BulletedList',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 35,
      depth: 1,
    },
  },
  '997b9485-bbb9-4489-a137-15a1a808aeeb': {
    id: '997b9485-bbb9-4489-a137-15a1a808aeeb',
    value: [
      {
        id: '4204c335-8cb1-4a39-813b-7e5062dfaf5c',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-bulleted-list-bullet',
            code: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 36,
      depth: 2,
    },
  },
  'e9e17217-3aab-4793-a505-fab8955bfc7b': {
    id: 'e9e17217-3aab-4793-a505-fab8955bfc7b',
    value: [
      {
        id: '454dab4f-bcb6-4271-9d01-db0c60fd4886',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-bulleted-list-content',
            code: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 37,
      depth: 2,
    },
  },
  '5b0f9de0-76cc-459d-a728-8b353a6d4ecd': {
    id: '5b0f9de0-76cc-459d-a728-8b353a6d4ecd',
    value: [
      {
        id: '39031db7-28e3-416e-9637-1fce1bc959ad',
        type: 'paragraph',
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
    type: 'Paragraph',
    meta: {
      order: 52,
      depth: 0,
    },
  },
  'a912d7a5-73c3-4df9-aa7f-d76ad1a54507': {
    id: 'a912d7a5-73c3-4df9-aa7f-d76ad1a54507',
    value: [
      {
        id: 'a2585fc2-8e8a-43ae-90fe-afd1aa0e6fbb',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-numbered-list',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'NumberedList',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 42,
      depth: 1,
    },
  },
  '295c5983-7017-4c80-ac87-df426a98d7a6': {
    id: '295c5983-7017-4c80-ac87-df426a98d7a6',
    value: [
      {
        id: '65314068-b636-4989-a18b-510a08737c49',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-heading-one',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Heading One',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 45,
      depth: 1,
    },
  },
  '163f4e1e-32bd-40cc-a00b-5aeff339b8b8': {
    id: '163f4e1e-32bd-40cc-a00b-5aeff339b8b8',
    value: [
      {
        id: '65314068-b636-4989-a18b-510a08737c49',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-heading-two',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Heading Two',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 46,
      depth: 1,
    },
  },
  '50b5d40b-1559-4411-8873-96139d9126b5': {
    id: '50b5d40b-1559-4411-8873-96139d9126b5',
    value: [
      {
        id: '65314068-b636-4989-a18b-510a08737c49',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-heading-three',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Heading Three',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 47,
      depth: 1,
    },
  },
  'd2fab762-94fc-4461-9c3e-ee7defe009b8': {
    id: 'd2fab762-94fc-4461-9c3e-ee7defe009b8',
    value: [
      {
        id: '65314068-b636-4989-a18b-510a08737c49',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-image',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Image',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 48,
      depth: 1,
    },
  },
  '2fac273f-7f6f-48cd-a556-b30f481b78af': {
    id: '2fac273f-7f6f-48cd-a556-b30f481b78af',
    value: [
      {
        id: '65314068-b636-4989-a18b-510a08737c49',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-video',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Video',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 49,
      depth: 1,
    },
  },
  '0e3e9964-853a-4be7-87d5-65c66e4fbb5e': {
    id: '0e3e9964-853a-4be7-87d5-65c66e4fbb5e',
    value: [
      {
        id: '65314068-b636-4989-a18b-510a08737c49',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-embed',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'Embed',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 50,
      depth: 1,
    },
  },
  '6ccd39ba-6513-4197-925a-5e9b211be2ef': {
    id: '6ccd39ba-6513-4197-925a-5e9b211be2ef',
    value: [
      {
        id: '65314068-b636-4989-a18b-510a08737c49',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-file',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'File',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 51,
      depth: 1,
    },
  },
  '483d49a7-ecd6-4fb3-8d9a-2023772c950f': {
    id: '483d49a7-ecd6-4fb3-8d9a-2023772c950f',
    value: [
      {
        id: '4248d096-ef74-4670-8829-12bd48f52e54',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-todo-list',
            code: true,
          },
          {
            text: ' - ',
          },
          {
            text: 'TodoList',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 38,
      depth: 1,
    },
  },
  '409373bb-dd55-453a-9c2e-337854477d83': {
    id: '409373bb-dd55-453a-9c2e-337854477d83',
    value: [
      {
        id: '7cbbae5b-2335-40e4-b936-a5a471a2308d',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-todo-list-checkbox ',
            code: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 39,
      depth: 2,
    },
  },
  'd01f81fb-0964-49c6-8216-d76c56d459c7': {
    id: 'd01f81fb-0964-49c6-8216-d76c56d459c7',
    value: [
      {
        id: 'c381ab0f-d2b0-449a-8e63-aec251d431bf',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-todo-list-checkbox-input',
            code: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 40,
      depth: 2,
    },
  },
  'd60b2acb-15cd-49ca-bccb-f7bef9e1a1c4': {
    id: 'd60b2acb-15cd-49ca-bccb-f7bef9e1a1c4',
    value: [
      {
        id: 'fc5209ae-9305-4fc1-9db8-9d683a357931',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-todo-list-content',
            code: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 41,
      depth: 2,
    },
  },
  '25d24d67-01d8-441c-a8d0-e4eef19fedc2': {
    id: '25d24d67-01d8-441c-a8d0-e4eef19fedc2',
    value: [
      {
        id: '4e06de68-7b67-4701-9850-8a066cb812e7',
        type: 'paragraph',
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
    type: 'Paragraph',
    meta: {
      order: 53,
      depth: 0,
    },
  },
  '784cc095-84a6-4e04-9a8d-b5bb75afc195': {
    id: '784cc095-84a6-4e04-9a8d-b5bb75afc195',
    value: [
      {
        id: '885f4a20-5999-43ff-aab8-2da04ece24d3',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-numbered-list-count',
            code: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 43,
      depth: 2,
    },
  },
  'e9383fe8-bc0e-4f1d-9b1a-813e0d4bcfb1': {
    id: 'e9383fe8-bc0e-4f1d-9b1a-813e0d4bcfb1',
    value: [
      {
        id: 'fb46943f-23cc-4bce-8313-38506586a300',
        type: 'bulleted-list',
        children: [
          {
            text: '.yoopta-numbered-list-content',
            code: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 44,
      depth: 2,
    },
  },
};
