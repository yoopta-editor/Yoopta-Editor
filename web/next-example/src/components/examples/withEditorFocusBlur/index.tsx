import YooptaEditor, {
  createYooptaEditor,
  useYooptaEditor,
  useYooptaFocused,
} from '@yoopta/editor';
import { useMemo, useRef } from 'react';

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

import { WITH_CUSTOM_STYLES_VALUE } from './initValue';
import { uploadToCloudinary } from '@/utils/cloudinary';

const plugins = [
  Paragraph,
  Table,
  Divider,
  HeadingOne,
  HeadingTwo.extend({
    options: {
      HTMLAttributes: {
        style: {
          color: 'green',
        },
      },
    },
  }),
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link.extend({
    options: {
      HTMLAttributes: {
        style: {
          color: 'green',
        },
      },
    },
  }),
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

function WithEditorFocusBlur() {
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  return (
    <div
      className="md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex justify-center flex-col items-center"
      ref={selectionRef}>
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        tools={TOOLS}
        marks={MARKS}
        autoFocus={false}
        selectionBoxRoot={selectionRef}>
        <FocusButtons />
        <Placeholder />
      </YooptaEditor>
    </div>
  );
}

const FocusButtons = () => {
  const editor = useYooptaEditor();

  return (
    <div className="md:top-2 md:right-2  top-[14.5px] right-[18px] flex z-50">
      <button
        type="button"
        className="relative mx-2 px-3 py-1 text-[14px] rounded text-white flex items-center bg-[#000]"
        onClick={() => editor.focus()}>
        Focus
      </button>
      <button
        type="button"
        className="relative mx-2 px-3 py-1 text-[14px] rounded text-white flex items-center bg-[#000]"
        onClick={() => editor.blur()}>
        Blur
      </button>
    </div>
  );
};

const Placeholder = () => {
  const isFocused = useYooptaFocused();

  if (!isFocused) {
    return (
      <div className="fixed md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px]">
        Placeholder
      </div>
    );
  }

  return null;
};

export default WithEditorFocusBlur;
