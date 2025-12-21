export const initValue = {
  'a6185d9e-5b51-4bba-b302-487d7d0b4562': {
    id: 'a6185d9e-5b51-4bba-b302-487d7d0b4562',
    value: [
      {
        id: '7312bd9f-d817-4ef8-b661-000ab4b7059d',
        type: 'heading-one',
        props: {
          nodeType: 'block',
        },
        children: [
          {
            text: 'Plugin events',
          },
        ],
      },
    ],
    type: 'HeadingOne',
    meta: {
      order: 0,
      depth: 0,
    },
  },
  '0cc6c313-a5a0-48ce-8d82-f6679a6dad4d': {
    id: '0cc6c313-a5a0-48ce-8d82-f6679a6dad4d',
    value: [
      {
        id: '4ea75685-49a5-464b-8faa-1e15b15d746b',
        type: 'paragraph',
        children: [
          {
            text: 'Now you can customize behaviour for plugins by adding events.',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'Paragraph',
    meta: {
      order: 1,
      depth: 0,
    },
  },
  '30578175-ba35-49c1-b0c4-7f60c2cba023': {
    id: '30578175-ba35-49c1-b0c4-7f60c2cba023',
    value: [
      {
        id: '0c18bdc8-751f-41e4-828a-9c33543515e4',
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
      order: 3,
      depth: 0,
    },
  },
  'fa9f6822-76a8-4b7d-bf7b-89a6263c89be': {
    id: 'fa9f6822-76a8-4b7d-bf7b-89a6263c89be',
    value: [
      {
        id: 'a007862a-e233-491d-a1e6-5c683ba4100a',
        type: 'code',
        props: {
          nodeType: 'void',
          language: 'javascript',
          theme: 'GithubDark',
        },
        children: [
          {
            text: "import Paragraph from '@yoopta/paragraph';\n\nconst plugins = [\n  Paragraph.extend({\n    events: {\n      \n      // It will be fired after the block is created\n      onCreate: (editor, blockId) => {\n        console.log('onCreate', blockId);\n      },\n      \n      // It will be fired after the block is deleted\n      onDestroy: (editor, blockId) => {\n        console.log('onCreate', blockId);\n      },\n      \n      // It will be fired before the block is created\n      // [NOTE] - USEFUL TO DEFINE INITIAL ELEMENS STRUCTURE FOR PLUGIN\n      // SEE EXAMPLE BELOW\n      beforeCreate: (editor, blockId) => {},\n      \n      // ...or typical DOM event handlers\n      // [NOTE] - DOM event handlers have a carry function\n      onClick(editor, slate, options) {\n        return (event) => {\n          \n        }\n      }, \n    }\n  }),\n]\n",
          },
        ],
      },
    ],
    type: 'Code',
    meta: {
      order: 2,
      depth: 0,
    },
  },
  '251d90d9-3910-435d-b635-58991b03a8ad': {
    id: '251d90d9-3910-435d-b635-58991b03a8ad',
    value: [
      {
        id: 'fc56b5df-2bb8-4f38-b405-2d299ca477f6',
        type: 'heading-two',
        props: {
          nodeType: 'block',
        },
        children: [
          {
            text: 'Use cases',
          },
        ],
      },
    ],
    type: 'HeadingTwo',
    meta: {
      order: 4,
      depth: 0,
    },
  },
  '5d8c45fe-abe9-4609-9f8d-54681e4c5a32': {
    id: '5d8c45fe-abe9-4609-9f8d-54681e4c5a32',
    value: [
      {
        id: '186c2a09-9ac3-4a92-9b80-519d1203321c',
        type: 'bulleted-list',
        children: [
          {
            text: 'Useful when you want track analytics for example',
          },
        ],
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 6,
      depth: 0,
    },
  },
  'ad8984c5-cf6f-4bb1-b5a9-a81e7b7c9a8d': {
    id: 'ad8984c5-cf6f-4bb1-b5a9-a81e7b7c9a8d',
    value: [
      {
        id: 'c7d29724-bc12-4e18-a328-0c26caf15272',
        type: 'bulleted-list',
        props: {
          nodeType: 'block',
        },
        children: [
          {
            text: "Let's imagine that we have external storage for our videos and images. And when a user deletes an image/video, we want to delete that image/video from storage. So, this event is just for these purposes",
          },
        ],
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 8,
      depth: 0,
    },
  },
  '3762eb1e-ff20-45c3-93a6-7779209f794d': {
    id: '3762eb1e-ff20-45c3-93a6-7779209f794d',
    value: [
      {
        id: 'd4cf8b29-f1e4-49aa-9989-489251a33fae',
        type: 'heading-three',
        props: {
          nodeType: 'block',
        },
        children: [
          {
            text: 'beforeCreate: (editor: YooEditor, blockId: string) => SlateElement',
            code: true,
          },
        ],
      },
    ],
    type: 'HeadingThree',
    meta: {
      order: 9,
      depth: 0,
    },
  },
  'e05ae45e-016b-4969-9027-4803cd591044': {
    id: 'e05ae45e-016b-4969-9027-4803cd591044',
    value: [
      {
        id: '0f474120-bcff-4307-a4d8-5a5b71274f79',
        type: 'bulleted-list',
        children: [
          {
            text: "A good choice if you want to redefine plugin elements before creating. Let's imagine that we want our Table to be created from 4 rows and 5 columns. \nHere is example how can handle this:",
          },
        ],
      },
    ],
    type: 'BulletedList',
    meta: {
      order: 10,
      depth: 0,
    },
  },
  'ee055fbd-19c6-496a-bab0-8caac4d12695': {
    id: 'ee055fbd-19c6-496a-bab0-8caac4d12695',
    type: 'HeadingThree',
    meta: {
      order: 5,
      depth: 0,
    },
    value: [
      {
        id: 'd0381843-3bf6-4caf-92fa-a1e99c67480a',
        type: 'heading-three',
        props: {
          nodeType: 'block',
        },
        children: [
          {
            text: 'onCreate: (editor, blockId) => void',
            code: true,
          },
        ],
      },
    ],
  },
  'c12e85a8-4c51-4bca-a577-858d0c11c9d2': {
    id: 'c12e85a8-4c51-4bca-a577-858d0c11c9d2',
    type: 'HeadingThree',
    meta: {
      order: 7,
      depth: 0,
    },
    value: [
      {
        id: '0880298b-3819-44a5-ab32-319bcba1ce54',
        type: 'heading-three',
        props: {
          nodeType: 'block',
        },
        children: [
          {
            text: 'onDestroy: (editor, blockId) => void',
            code: true,
          },
        ],
      },
    ],
  },
  '1aa9d041-384b-4ef8-ba6d-e0218bce3b6c': {
    id: '1aa9d041-384b-4ef8-ba6d-e0218bce3b6c',
    value: [
      {
        id: '04c44cb1-68e2-46a3-b19b-893df87c558c',
        type: 'code',
        props: {
          nodeType: 'void',
          language: 'javascript',
          theme: 'GithubDark',
        },
        children: [
          {
            text: 'const plugins = [\n Table.extend({\n    events: {\n      beforeCreate: (editor, blockId) => {\n        return TableCommands.buildTableElements(editor, { rows: 4, columns: 5, headerRow: true, headerColumn: true });\n      },\n    },\n  })\n]',
          },
        ],
      },
    ],
    type: 'Code',
    meta: {
      order: 11,
      depth: 1,
    },
  },
  '67994f7b-cb76-4e3e-aef1-fecf969819b6': {
    id: '67994f7b-cb76-4e3e-aef1-fecf969819b6',
    value: [
      {
        id: 'ec7f1e6d-a66b-41f1-a2bf-48ef499d2c5b',
        type: 'paragraph',
        children: [
          {
            text: 'So, we redefined default behaviour. Try to create Table now and see result!',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    type: 'Paragraph',
    meta: {
      order: 12,
      depth: 0,
    },
  },
};
