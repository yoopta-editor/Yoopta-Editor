import YooptaEditor, {
  Blocks,
  createYooptaEditor,
  generateId,
  YooptaOnChangeOptions,
  YooEditor,
  YooptaBlockData,
  YooptaContentValue,
  YooptaPath,
} from '@yoopta/editor';
import { useEffect, useMemo, useRef, useState } from 'react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';
import { FixedToolbar } from '../../components/FixedToolbar/FixedToolbar';

const EDITOR_STYLE = {
  width: 750,
};

const data = {
  '25b34678-649c-4b6f-87d4-8e595400980f': {
    id: '25b34678-649c-4b6f-87d4-8e595400980f',
    type: 'HeadingTwo',
    value: [
      {
        id: '1a7583b7-03c3-47f7-a4b1-f3c3b6e2dd39',
        type: 'heading-two',
        children: [
          {
            text: 'Introduction',
          },
        ],
        props: {
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
  '6f7ba884-86eb-4022-9737-c619e82db325': {
    id: '6f7ba884-86eb-4022-9737-c619e82db325',
    type: 'Paragraph',
    value: [
      {
        id: '6fe041be-4e0a-470b-853b-613eaca05d44',
        type: 'paragraph',
        children: [
          {
            text: 'Yoopta-Editor is a free, open-source rich-text editor built for React apps. It’s packed with features that let you build an editor as powerful and user-friendly as Notion, Craft, Coda, Medium etc.',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 1,
    },
  },
  '35d3afa9-0504-4d39-a1e8-4e816f005730': {
    id: '35d3afa9-0504-4d39-a1e8-4e816f005730',
    type: 'Paragraph',
    value: [
      {
        id: '4f6d474b-58dc-4715-a568-4e96445fd10f',
        type: 'paragraph',
        children: [
          {
            text: 'With Yoopta-Editor, you can customize everything to fit exactly what you need. Want to tweak the look, add cool features, or craft a completely custom user interface? No problem. Yoopta-Editor gives you the flexibility to do it all, making it easy to create the perfect tool for your project. All of this is customizable, extensible, and easy to set up!',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 2,
    },
  },
  'f5ab2f00-721a-4234-884c-1258d0195fb1': {
    id: 'f5ab2f00-721a-4234-884c-1258d0195fb1',
    type: 'HeadingTwo',
    value: [
      {
        id: '737bfdb0-4f23-4b8a-92ee-f84860ffdb6f',
        type: 'heading-two',
        children: [
          {
            text: 'Features',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 3,
    },
  },
  'b83ebb17-28e8-4e38-867f-9911d9b50fde': {
    id: 'b83ebb17-28e8-4e38-867f-9911d9b50fde',
    type: 'BulletedList',
    value: [
      {
        id: '6011fc69-3409-4b5d-889f-6bc494bdcc06',
        type: 'bulleted-list',
        children: [
          {
            text: 'Easy setup',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 4,
    },
  },
  '70109e70-2637-446e-82a3-f89cb45119d2': {
    id: '70109e70-2637-446e-82a3-f89cb45119d2',
    type: 'BulletedList',
    value: [
      {
        id: '7f49e926-6c0d-4ef6-a624-a6aef17fcfe6',
        type: 'bulleted-list',
        children: [
          {
            text: 'Default list of powerful plugins',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 5,
    },
  },
  'f7486103-5946-4358-8d0e-58ea7593bc4f': {
    id: 'f7486103-5946-4358-8d0e-58ea7593bc4f',
    type: 'BulletedList',
    value: [
      {
        id: 'dddf9382-b9d8-4060-863e-aba61a2eec43',
        type: 'bulleted-list',
        children: [
          {
            text: 'Many typical solved problems in UX behaviour.',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 6,
    },
  },
  'b50225f1-89d6-46ac-9d85-b618ee1b8a32': {
    id: 'b50225f1-89d6-46ac-9d85-b618ee1b8a32',
    type: 'BulletedList',
    value: [
      {
        id: 'b5c2ec26-9f43-4822-b5f3-8731fdc5b61d',
        type: 'bulleted-list',
        children: [
          {
            text: 'Media plugins on steroids with optimization and lazy loadings',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 7,
    },
  },
};

const BasicExample = () => {
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<YooptaContentValue>(data);

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    console.log('onChange', value, options);
    setValue(value);
  };

  const onPathChange = (path: YooptaPath) => {};

  // useEffect(() => {
  //   editor.withoutSavingHistory(() => {
  //     const id = generateId();

  //     editor.setEditorValue(data as YooptaContentValue);
  //     editor.focusBlock(id);
  //   });
  // }, []);

  return (
    <>
      <div className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col items-center" ref={selectionRef}>
        <FixedToolbar editor={editor} DEFAULT_DATA={data} />
        <YooptaEditor
          editor={editor}
          plugins={YOOPTA_PLUGINS}
          selectionBoxRoot={selectionRef}
          marks={MARKS}
          autoFocus={true}
          readOnly={false}
          placeholder="Type / to open menu"
          tools={TOOLS}
          style={EDITOR_STYLE}
          value={value}
          onChange={onChange}
          onPathChange={onPathChange}
        />
      </div>
    </>
  );
};

export default BasicExample;
