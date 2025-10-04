import YooptaEditor, {
  createYooptaEditor,
  Elements,
  Blocks,
  useYooptaEditor,
} from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Accordion from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

import { uploadToCloudinary } from '@/utils/cloudinary';
import { useEffect, useMemo, useRef } from 'react';
import { Head } from '@/components/Head/Head';

const plugins = [
  Paragraph,
  Accordion,
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

function WithBaseFullSetup() {
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  return (
    <>
      <Head title="Yoopta - Playground" />
      <div
        id="playground"
        className="lg:px-[120px] px-[15px] lg:pt-[80px] pt-[40px] pb-[40px] lg:max-w-[65vw] max-w-none mx-auto flex justify-center"
        ref={selectionRef}>
        <YooptaEditor
          editor={editor}
          plugins={plugins}
          tools={TOOLS}
          marks={MARKS}
          selectionBoxRoot={selectionRef}
          style={{ width: '100%', height: '100%' }}
          autoFocus
          placeholder='Type "/" for commands'
        />
      </div>
    </>
  );
}

export default WithBaseFullSetup;
