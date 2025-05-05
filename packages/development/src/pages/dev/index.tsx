import YooptaEditor, {
  createYooptaEditor,
  YooptaOnChangeOptions,
  YooEditor,
  YooptaContentValue,
  YooptaPath,
} from '@yoopta/editor';
import { useMemo, useRef, useState } from 'react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';
import { FixedToolbar } from '../../components/FixedToolbar/FixedToolbar';

const EDITOR_STYLE = {
  width: 750,
};

const data = {
  'a9ef3fc2-0252-48db-bbf6-42436d257f13': {
    id: 'a9ef3fc2-0252-48db-bbf6-42436d257f13',
    type: 'GridCard',
    meta: {
      depth: 0,
      order: 0,
    },
    value: [
      {
        id: '6552b9e9-06ac-4852-8ce6-fcd46e3ef426',
        type: 'grid',
        props: {
          columns: '2',
          gap: 'md',
          minItemWidth: '200px',
          padding: 'none',
          containerWidth: 'full',
          background: 'transparent',
          border: false,
        },
        children: [
          {
            id: '7a076fc0-2247-485d-a7a4-ee311bf674e8',
            type: 'grid-item',
            children: [
              {
                id: '40bf41c2-adee-4b67-b219-bf02153ad6eb',
                type: 'grid-item-header',
                children: [
                  {
                    id: '40f4fe77-6796-4b4f-b52f-ffd25b6d8b3b',
                    type: 'grid-item-image',
                    children: [
                      {
                        text: '',
                      },
                    ],
                    props: {
                      nodeType: 'void',
                      fit: 'fill',
                      src: 'https://res.cloudinary.com/ench-app/image/upload/v1713029072/ImageTransformer_hlr9eo.jpg',
                    },
                  },
                ],
                props: {
                  nodeType: 'block',
                  align: 'left',
                },
              },
              {
                id: '77ade46f-753f-46bc-9c59-43eae64a8301',
                type: 'grid-item-content',
                children: [
                  {
                    id: '2d1f52c0-e505-4f91-8b6c-da687758801f',
                    type: 'grid-item-title',
                    children: [
                      {
                        text: '',
                      },
                    ],
                    props: {
                      nodeType: 'block',
                      size: 'md',
                    },
                  },
                  {
                    id: '48e1319e-3b15-4034-894d-efa132b031bf',
                    type: 'grid-item-description',
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
                  padding: 'md',
                },
              },
            ],
            props: {
              nodeType: 'block',
              colspan: 1,
              rowspan: 1,
              variant: 'default',
              aspectRatio: '1/1',
              background: 'none',
              border: false,
            },
          },
          {
            id: 'c861e75d-81fe-4faf-8801-8062a0dd891a',
            type: 'grid-item',
            children: [
              {
                id: 'efdc4b8f-1996-4028-8516-203624ba9421',
                type: 'grid-item-header',
                children: [
                  {
                    id: '3c3b37cf-85d0-4505-9696-4a1656aa8159',
                    type: 'grid-item-image',
                    children: [
                      {
                        text: '',
                      },
                    ],
                    props: {
                      nodeType: 'void',
                      fit: 'fill',
                      src: 'https://res.cloudinary.com/ench-app/image/upload/v1731103395/c0dc98f5-da0b-430a-b9b4-144f9a25b3b9_rqcqcc_utkcnh.webp',
                    },
                  },
                ],
                props: {
                  nodeType: 'block',
                  align: 'left',
                },
              },
              {
                id: 'bb8a1e5c-908e-479d-a7ed-3f3b75607e3c',
                type: 'grid-item-content',
                children: [
                  {
                    id: '7a62f824-3900-44e1-8139-293c28dd0e37',
                    type: 'grid-item-title',
                    children: [
                      {
                        text: '',
                      },
                    ],
                    props: {
                      nodeType: 'block',
                      size: 'md',
                    },
                  },
                  {
                    id: '6c306c29-77ed-4f3c-9be3-25ed0e8562f5',
                    type: 'grid-item-description',
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
                  padding: 'md',
                },
              },
            ],
            props: {
              nodeType: 'block',
              colspan: 1,
              rowspan: 1,
              variant: 'default',
              aspectRatio: '1/1',
              background: 'none',
              border: false,
            },
          },
          {
            id: 'ba6e3099-a35d-4ccf-8184-f041b6883d0d',
            type: 'grid-item',
            children: [
              {
                id: 'fcdfbab5-f9fe-44bb-a85e-b29175bd7631',
                type: 'grid-item-header',
                children: [
                  {
                    id: '9d168a31-6a35-4734-82af-6352f76095d7',
                    type: 'grid-item-image',
                    children: [
                      {
                        text: '',
                      },
                    ],
                    props: {
                      nodeType: 'void',
                      fit: 'fill',
                      src: 'https://res.cloudinary.com/ench-app/image/upload/v1720360714/e608ab26-d8fd-44b6-8859-b35abc4b5558_oifyp1_dfv72b.webp',
                    },
                  },
                ],
                props: {
                  nodeType: 'block',
                  align: 'left',
                },
              },
              {
                id: '4409ca04-33a4-40b4-83d5-ecf9f73a8cf2',
                type: 'grid-item-content',
                children: [
                  {
                    id: 'c5fe8881-058a-4b13-b8d9-003284c66ae9',
                    type: 'grid-item-title',
                    children: [
                      {
                        text: '',
                      },
                    ],
                    props: {
                      nodeType: 'block',
                      size: 'md',
                    },
                  },
                  {
                    id: '3ac5156f-dad9-47c0-9e5c-809a9046d3c0',
                    type: 'grid-item-description',
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
                  padding: 'md',
                },
              },
            ],
            props: {
              nodeType: 'block',
              colspan: 1,
              rowspan: 1,
              variant: 'default',
              aspectRatio: '1/1',
              background: 'none',
              border: false,
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
