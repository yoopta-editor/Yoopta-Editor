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
  'aa5bf885-806c-4a79-8299-4abba02fd5bc': {
    id: 'aa5bf885-806c-4a79-8299-4abba02fd5bc',
    type: 'Tabs',
    meta: {
      depth: 0,
      order: 0,
    },
    value: [
      {
        id: '43894c6f-a3c8-43f5-a98d-c5abfd11cdc9',
        type: 'tabs-list',
        children: [
          {
            id: 'b7e1a9db-a0dc-416c-95cb-5af04052d82d',
            type: 'tabs-list-item',
            children: [
              {
                id: '1e72cd1f-8e66-4d0b-8b77-b9468cf63cb6',
                type: 'tab-list-item-title',
                children: [
                  {
                    text: 'Tab 1',
                  },
                ],
              },
              {
                id: 'b7783d2a-0b7f-4be4-9a12-3510eea657a1',
                type: 'tab-list-item-content',
                children: [
                  {
                    text: '',
                  },
                ],
              },
            ],
            props: {
              active: true,
            },
          },
          {
            id: '9778dac7-ff05-495a-a972-3d26ee3559ed',
            type: 'tabs-list-item',
            children: [
              {
                id: '65ebe645-8a0c-4d46-ace1-da62ca9af6e9',
                type: 'tab-list-item-title',
                children: [
                  {
                    text: 'Title 2',
                  },
                ],
              },
              {
                id: '5b67403a-b9bd-4fd9-91e3-fe34397efc13',
                type: 'tab-list-item-content',
                children: [
                  {
                    text: '',
                  },
                ],
              },
            ],
            props: {
              active: false,
            },
          },
          {
            id: '11ad75c7-97aa-4fe0-b081-24660980bf7f',
            type: 'tabs-list-item',
            children: [
              {
                id: '5d1dcdd0-95e0-4fa0-8bd0-d62da8c33081',
                type: 'tab-list-item-title',
                children: [
                  {
                    text: 'Title 3',
                  },
                ],
              },
              {
                id: '32b165d8-779b-4785-b0dd-a17643c3a5f0',
                type: 'tab-list-item-content',
                children: [
                  {
                    text: '',
                  },
                ],
              },
            ],
            props: {
              active: false,
            },
          },
        ],
      },
    ],
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
