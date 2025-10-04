import YooptaEditor, {
  createYooptaEditor,
  Elements,
  Blocks,
  useYooptaEditor,
  YooEditor,
  YooptaContentValue,
  YooptaPathIndex,
} from '@yoopta/editor';

import Paragraph, { ParagraphCommands } from '@yoopta/paragraph';
import Blockquote, { BlockquoteCommands } from '@yoopta/blockquote';
import Embed, { EmbedCommands } from '@yoopta/embed';
import Image, { ImageCommands } from '@yoopta/image';
import Link, { LinkCommands } from '@yoopta/link';
import Callout, { CalloutCommands } from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Accordion, { AccordionCommands } from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingOneCommands, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table, { TableCommands } from '@yoopta/table';
import Divider, { DividerCommands } from '@yoopta/divider';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

import { uploadToCloudinary } from '@/utils/cloudinary';
import { useEffect, useMemo, useRef, useState } from 'react';
import { WITH_EDITOR_HISTORY_API_VALUE } from './initValue';

const plugins = [
  Paragraph,
  Table,
  Divider,
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

function WithEditorHistory() {
  const [value, setValue] = useState<YooptaContentValue>(WITH_EDITOR_HISTORY_API_VALUE);
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  return (
    <div
      className="md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex flex-col items-center justify-center"
      ref={selectionRef}>
      <FixedToolbar editor={editor} />
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        tools={TOOLS}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        value={value}
        onChange={(val: YooptaContentValue) => setValue(val)}
        autoFocus
      />
    </div>
  );
}

type Props = {
  editor: YooEditor;
};

const FixedToolbar = ({ editor }: Props) => {
  return (
    <div className="bg-white z-50">
      <div className="flex justify-center mb-2">
        <button
          type="button"
          onClick={() => {
            editor.redo({ scroll: false });
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff] disabled:opacity-50"
          disabled={editor.historyStack.redos.length === 0}>
          Redo
        </button>
        <button
          type="button"
          onClick={() => {
            editor.undo({ scroll: false });
          }}
          className="p-2 text-xs shadow-md hover:bg-[#64748b] hover:text-[#fff] disabled:opacity-50"
          disabled={editor.historyStack.undos.length === 0}>
          Undo
        </button>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            TableCommands.insertTable(editor, { rows: 3, columns: 3, headerRow: true, at: 0 });
          }}
          className="p-2 text-xs shadow-md hover:bg-[#64748b] hover:text-[#fff] disabled:opacity-50">
          Insert table with saving in history
        </button>
        <button
          type="button"
          onClick={() => {
            editor.withoutSavingHistory(() => {
              TableCommands.insertTable(editor, { rows: 3, columns: 3, headerRow: true, at: 0 });
            });
          }}
          className="p-2 text-xs shadow-md hover:bg-[#64748b] hover:text-[#fff] disabled:opacity-50">
          Insert table without saving in history
        </button>
      </div>
    </div>
  );
};

export default WithEditorHistory;
