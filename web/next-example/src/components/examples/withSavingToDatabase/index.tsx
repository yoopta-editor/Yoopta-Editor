import YooptaEditor, {
  createYooptaEditor,
  YooptaContentValue,
  YooptaEventChangePayload,
} from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Divider from '@yoopta/divider';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
// import { DividerPlugin } from './customPlugins/Divider';

import { Sheet } from '@/components/ui/sheet';

import { uploadToCloudinary } from '@/utils/cloudinary';
import { useEffect, useMemo, useRef, useState } from 'react';
import { withSavingToDatabaseValue } from './initValue';
import { useDebounce } from 'use-debounce';

const plugins = [
  Paragraph,
  Table,
  Divider,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
  Image.extend({
    options: {
      async onUpload(file) {
        const data = await uploadToCloudinary(file, 'image');

        return {
          src: data.secure_url,
          alt: 'cloudinary',
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
    },
  }),
  Video.extend({
    options: {
      onUpload: async (file) => {
        const data = await uploadToCloudinary(file, 'video');
        return {
          src: data.secure_url,
          alt: 'cloudinary',
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
      onUploadPoster: async (file) => {
        const image = await uploadToCloudinary(file, 'image');
        return image.secure_url;
      },
    },
  }),
  File.extend({
    options: {
      onUpload: async (file) => {
        const response = await uploadToCloudinary(file, 'auto');
        return {
          src: response.secure_url,
          format: response.format,
          name: response.name,
          size: response.bytes,
        };
      },
    },
  }),
];

const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

function WithSavingToDatabase() {
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);
  const [value, setValue] = useState<YooptaContentValue>(withSavingToDatabaseValue);
  const [debouncedValue] = useDebounce(value, 1000);

  const fetchToServer = async (data: YooptaContentValue, showAlert = false) => {
    //...your async call to server
    console.log('SUBMITED DATA', data);
    if (showAlert) {
      alert('check your content data in console');
    }
  };

  const onSaveToServer = async () => {
    const editorContent = editor.getEditorValue();
    await fetchToServer(editorContent, true);
  };

  function handleChange(payload: YooptaEventChangePayload) {
    console.log('DATA ON CHANGE', payload.value);
  }

  // [TODO] - UPDATE EXAMPLE
  useEffect(() => {
    editor.on('change', handleChange);
    return () => {
      editor.off('change', handleChange);
    };
  }, [editor]);

  const onChange = (newValue: YooptaContentValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchToServer(value);
  }, [debouncedValue]);

  return (
    <div
      className="md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex flex-col justify-center items-center"
      ref={selectionRef}>
      <button
        type="button"
        onClick={onSaveToServer}
        className="bg-[#007aff] text-[14px] text-nowrap my-2 mr-0 md:mr-4 text-[#fff] max-w-[100px] px-4 py-2 rounded-md">
        Save data
      </button>
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        tools={TOOLS}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default WithSavingToDatabase;
