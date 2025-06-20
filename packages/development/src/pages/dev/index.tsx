import YooptaEditor, {
  createYooptaEditor,
  YooptaOnChangeOptions,
  YooEditor,
  YooptaContentValue,
  YooptaPath,
} from '@yoopta/editor';
import { MentionCommands, MentionDropdown, withMentions } from '@yoopta/mention';
import { FloatingBlockActions, BlockOptions, Portal } from '@yoopta/ui';
import { useMemo, useRef, useState } from 'react';
import { Trash2Icon, CopyIcon, Link2Icon, RotateCcwIcon } from 'lucide-react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';
import { FixedToolbar } from '../../components/FixedToolbar/FixedToolbar';

const EDITOR_STYLE = {
  width: 750,
};

const data = {
  '6f7ba884-86eb-4022-9737-c619e82db325': {
    id: '6f7ba884-86eb-4022-9737-c619e82db325',
    type: 'Paragraph',
    value: [
      {
        id: '6fe041be-4e0a-470b-853b-613eaca05d44',
        type: 'paragraph',
        children: [
          {
            text: "Yoopta-Editor is a free, open-source rich-text editor built for React apps. It's packed with features that let you build an editor as powerful and ",
          },
          {
            type: 'mention',
            children: [
              {
                text: '',
              },
            ],
            props: {
              id: '613eaca05d44',
              name: 'akhmed ibragimov',
              nodeType: 'inlineVoid',
            },
          },
          {
            text: '.',
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
  'b92b94b1-8307-4ace-a7da-b8771310e9d0': {
    id: 'b92b94b1-8307-4ace-a7da-b8771310e9d0',
    type: 'Callout',
    meta: {
      depth: 0,
      order: 0,
    },
    value: [
      {
        id: 'e3302662-f4df-4adf-b6f5-80448b6789b3',
        type: 'callout',
        props: {
          theme: 'info',
        },
        children: [
          {
            text: 'heading one',
          },
          {
            text: 'description one',
          },
          {
            text: 'heading two',
          },
          {
            text: 'aadescription two',
          },
        ],
      },
    ],
  },
};

const fetchUsers = async (query: string): Promise<any[]> => {
  try {
    const url = new URL('http://localhost:3001/users');

    if (query) {
      url.searchParams.set('q', query);
    }

    url.searchParams.set('_limit', '10');

    const response = await fetch(url.toString());
    const users: any[] = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

const BasicExample = () => {
  const editor: YooEditor = useMemo(() => withMentions(createYooptaEditor()), []);
  const selectionRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<YooptaContentValue>(data);
  const [isBlockOptionsOpen, setIsBlockOptionsOpen] = useState(false);

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    console.log('onChange', value, options);
    setValue(value);
  };

  const onPathChange = (path: YooptaPath) => {};

  const handleDelete = () => {
    console.log('Delete block');
    setIsBlockOptionsOpen(false);
  };

  const handleDuplicate = () => {
    console.log('Duplicate block');
    setIsBlockOptionsOpen(false);
  };

  const handleCopy = () => {
    console.log('Copy block link');
    setIsBlockOptionsOpen(false);
  };

  const handleTurnInto = () => {
    console.log('Turn into');
    setIsBlockOptionsOpen(false);
  };

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
        >
          <FloatingBlockActions.Root hideDelay={100}>
            <FloatingBlockActions.PlusAction />
            <FloatingBlockActions.DragAction onClick={() => setIsBlockOptionsOpen(true)}>
              <BlockOptions.Root
                isOpen={isBlockOptionsOpen}
                onClose={() => setIsBlockOptionsOpen(false)}
                refs={{ setFloating: () => {} }}
              >
                <BlockOptions.Content>
                  <BlockOptions.Group>
                    <BlockOptions.Item>
                      <BlockOptions.Button icon={<Trash2Icon size={16} />} onClick={handleDelete}>
                        Delete
                      </BlockOptions.Button>
                    </BlockOptions.Item>
                    <BlockOptions.Item>
                      <BlockOptions.Button icon={<CopyIcon size={16} />} onClick={handleDuplicate}>
                        Duplicate
                      </BlockOptions.Button>
                    </BlockOptions.Item>
                    <BlockOptions.Separator />
                    <BlockOptions.Item>
                      <BlockOptions.Button icon={<Link2Icon size={16} />} onClick={handleCopy}>
                        Copy link to block
                      </BlockOptions.Button>
                    </BlockOptions.Item>
                    <BlockOptions.Item>
                      <BlockOptions.Button icon={<RotateCcwIcon size={16} />} onClick={handleTurnInto}>
                        Turn into
                      </BlockOptions.Button>
                    </BlockOptions.Item>
                  </BlockOptions.Group>
                </BlockOptions.Content>
              </BlockOptions.Root>
            </FloatingBlockActions.DragAction>
            <FloatingBlockActions.Action>
              <Trash2Icon size={16} />
            </FloatingBlockActions.Action>
          </FloatingBlockActions.Root>
        </YooptaEditor>
      </div>
    </>
  );
};

export default BasicExample;
