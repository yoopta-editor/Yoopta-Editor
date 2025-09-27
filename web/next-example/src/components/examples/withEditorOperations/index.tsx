import YooptaEditor, {
  createYooptaEditor,
  Elements,
  Blocks,
  useYooptaEditor,
  YooEditor,
  YooptaContentValue,
  YooptaPathIndex,
  YooptaOnChangeOptions,
} from '@yoopta/editor';

import Paragraph, { ParagraphCommands } from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed, { EmbedCommands } from '@yoopta/embed';
import Image, { ImageCommands } from '@yoopta/image';
import Link, { LinkCommands } from '@yoopta/link';
import Callout, { CalloutCommands } from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Accordion, { AccordionCommands } from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import {
  HeadingOne,
  HeadingOneCommands,
  HeadingThree,
  HeadingThreeCommands,
  HeadingTwo,
  HeadingTwoCommands,
} from '@yoopta/headings';
import Code from '@yoopta/code';
import Table, { TableCommands } from '@yoopta/table';
import Divider, { DividerCommands } from '@yoopta/divider';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import { uploadToCloudinary } from '@/utils/cloudinary';
import { useMemo, useRef, useState } from 'react';
import { WITH_OPERATIONS_VALUE } from './initValue';
import { toast } from 'sonner';

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

function WithEditorOperations() {
  const [value, setValue] = useState<YooptaContentValue>(
    WITH_OPERATIONS_VALUE as YooptaContentValue,
  );
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  const onChange = (val: YooptaContentValue, options: YooptaOnChangeOptions) => {
    setValue(val);
    toast(
      <p>
        On change operation name:{' '}
        <code className="bg-[#f2f2f2] text-[#000] px-[6px] py-[3px] rounded-[4px]">
          {options.operations.map((op) => op.type).join(', ')}
        </code>
      </p>,
    );
  };

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
        onChange={onChange}
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
            HeadingOneCommands.insertHeadingOne(editor, { at: 0, text: 'First heading' });
            HeadingTwoCommands.insertHeadingTwo(editor, { at: 1, text: 'Second heading' });
            HeadingThreeCommands.insertHeadingThree(editor, { at: 2, text: 'Third heading' });

            toast(
              <p>
                Three headings inserted
                <code className="my-4">
                  <pre className="bg-[#0d1116] text-[#fff] p-2">
                    HeadingOneCommands.insertHeadingOne(editor, {'{'} at: 0, text: 'First heading'{' '}
                    {'}'});
                    <br />
                    HeadingTwoCommands.insertHeadingTwo(editor, {'{'} at: 1, text: 'Second heading'{' '}
                    {'}'});
                    <br />
                    HeadingThreeCommands.insertHeadingThree(editor, {'{'} at: 2, text: 'Third
                    heading' {'}'});
                  </pre>
                </code>
                Try to undo (ctrl+z) to see the effect.
              </p>,
            );
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff] disabled:opacity-50">
          Call three operations without <code>batchOperations</code> and then run{' '}
          <code>undo (ctrl+z)</code>
        </button>
        <button
          type="button"
          onClick={() => {
            editor.batchOperations(() => {
              HeadingOneCommands.insertHeadingOne(editor, { at: 0, text: 'First heading' });
              HeadingTwoCommands.insertHeadingTwo(editor, { at: 1, text: 'Second heading' });
              HeadingThreeCommands.insertHeadingThree(editor, { at: 2, text: 'Third heading' });
            });

            toast(
              <p>
                Three headings inserted wrapped in <code>batchOperations</code>.
                <code className="pt-4">
                  <pre className="bg-[#0d1116] text-[#fff] p-2 rounded-[4px]">
                    editor.batchOperations(() ={'>'} {'{'}
                    <br />
                    &nbsp;&nbsp;HeadingOneCommands.insertHeadingOne(editor, {'{'} at: 0, text:
                    'First heading' {'}'});
                    <br />
                    &nbsp;&nbsp;HeadingTwoCommands.insertHeadingTwo(editor, {'{'} at: 1, text:
                    'Second heading' {'}'}
                    );
                    <br />
                    &nbsp;&nbsp;HeadingThreeCommands.insertHeadingThree(editor, {'{'} at: 2, text:
                    'Third heading' {'}'}
                    );
                    <br />
                    {'}'});
                  </pre>
                </code>
                Try to undo (ctrl+z) to see the effect.
              </p>,
            );
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff] disabled:opacity-50">
          Call three operations inside <code>batchOperations</code> and then run{' '}
          <code>undo (ctrl+z)</code>
        </button>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            const ParagraphBlock = Blocks.buildBlockData({
              value: [
                ParagraphCommands.buildParagraphElements(editor, { text: 'Inserted paragraph' }),
              ],
            });

            editor.applyTransforms([
              {
                type: 'insert_block',
                block: ParagraphBlock,
                path: editor.path,
              },
            ]);
          }}
          className="p-2 text-xs shadow-md hover:bg-[#64748b] hover:text-[#fff] disabled:opacity-50">
          applyTransforms with <code>insert_block</code> operation
        </button>
        <button
          type="button"
          onClick={() => {
            const firstBlock = Blocks.getBlock(editor, { at: 0 });
            if (firstBlock) {
              editor.applyTransforms([
                {
                  type: 'delete_block',
                  block: firstBlock,
                  path: editor.path,
                },
              ]);
            }
          }}
          className="p-2 text-xs shadow-md hover:bg-[#64748b] hover:text-[#fff] disabled:opacity-50">
          applyTransforms with <code>delete_block</code> operation
        </button>
      </div>
    </div>
  );
};

export default WithEditorOperations;
