import Paragraph, { ParagraphCommands } from '@yoopta/paragraph';
import Embed, { EmbedCommands } from '@yoopta/embed';
import Image, { ImageCommands } from '@yoopta/image';
import Link, { LinkCommands } from '@yoopta/link';
import Callout, { CalloutCommands } from '@yoopta/callout';

import { AccordionCommands } from '@yoopta/accordion';
import { TodoListCommands } from '@yoopta/lists';
import { HeadingOne, HeadingOneCommands, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Table, { TableCommands } from '@yoopta/table';
import { Blocks, Elements, YooEditor, Paths, YooptaPathIndex } from '@yoopta/editor';

type Props = {
  editor: YooEditor;
  DEFAULT_DATA: any;
};

export const FixedToolbar = ({ editor, DEFAULT_DATA }: Props) => {
  return (
    <div className="bg-white z-50">
      <div className="flex justify-center mb-2">
        {DEFAULT_DATA && (
          <button
            type="button"
            onClick={() => {
              editor.setEditorValue(DEFAULT_DATA);
            }}
            className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff]"
          >
            Set data into editor
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            const imageElements = ImageCommands.buildImageElements(editor, {
              props: {
                src: 'https://res.cloudinary.com/ench-app/image/upload/v1713028758/Cheems_doge_fx8yvq.jpg',
                alt: 'Insert image',
                fit: 'cover',
                bgColor: '#f3f4f6',
              },
            });

            const block = Blocks.buildBlockData({ value: [imageElements], type: 'Image' });
            editor.insertBlock('Image', { blockData: block, at: 1, focus: true });
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff]"
        >
          Insert Image
        </button>
        <button
          type="button"
          onClick={() => {
            const at: YooptaPathIndex = typeof editor.path.current ? editor.path.current : 2;
            console.log('toggleBlock at', at);
            editor.toggleBlock('Blockquote', { at: at, focus: true });
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff]"
        >
          Toggle into Blockquote
        </button>
        <button
          type="button"
          onClick={() => {
            editor.batchOperations(() => {
              // const calloutElement = CalloutCommands.buildCalloutElements(editor, {
              //   text: 'Heading with text',
              //   props: { theme: 'warning' },
              // });

              CalloutCommands.insertCallout(editor, {
                at: 1,
                focus: true,
                props: { theme: 'error' },
                text: 'Callout',
              });

              TodoListCommands.insertTodoList(editor, {
                at: 1,
                focus: true,
                props: { checked: true },
                text: 'Todo list',
              });
            });

            // editor.insertBlock('Callout', {
            //   at: 1,
            //   focus: true,
            //   blockData: { value: [calloutElement] },
            // });
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff]"
        >
          Insert Callout
        </button>
        <button
          type="button"
          onClick={() => {
            const originPath: YooptaPathIndex = editor.path.current || 0;
            // editor.duplicateBlock({ at: 0, original: { path: originPath } });
            Blocks.duplicateBlock(editor, { original: { path: originPath } });
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff]"
        >
          Duplicate block
        </button>
        <button
          type="button"
          onClick={() => {
            EmbedCommands.insertEmbed(editor, {
              at: 1,
            });
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff]"
        >
          Insert Embed
        </button>
        <button
          type="button"
          onClick={() => {
            TableCommands.insertTable(editor, { rows: 3, columns: 3, headerRow: true, at: 1 });
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff]"
        >
          Insert Table 3x3
        </button>
        <button
          type="button"
          onClick={() => {
            TableCommands.insertTable(editor, { rows: 6, columns: 4, at: 0 });
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff]"
        >
          Insert Table 6x4
        </button>
        <button
          type="button"
          onClick={() => {
            editor.setPath({ current: null, selected: [0, 1, 2, 3] });
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff]"
        >
          Choose selected
        </button>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            ParagraphCommands.insertParagraph(editor, { at: 0, focus: true });
            const block = Blocks.getBlock(editor, { at: 0 });
            const slate = Blocks.getBlockSlate(editor, { at: 0 });

            if (!slate || !block) return;

            // [BUG] Need to wait for the block to be focused
            setTimeout(() => {
              LinkCommands.insertLink(editor, {
                slate,
                props: { url: 'https://yoopta.dev', target: '_blank', rel: 'noopener noreferrer' },
              });
            }, 0);
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff]"
        >
          Insert Link
        </button>
        <button
          type="button"
          onClick={() => {
            AccordionCommands.insertAccordion(editor, { at: 1, items: 4 });
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff]"
        >
          Insert Accordion with 4 items
        </button>
        <button
          type="button"
          onClick={() => {
            HeadingOneCommands.insertHeadingOne(editor, { at: 1, text: 'Heading with text', focus: true });
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff]"
        >
          Insert Heading 1 with text
        </button>
        <button
          type="button"
          onClick={() => {
            editor.redo({ scroll: false });
          }}
          className="p-2 text-xs shadow-md border-r hover:bg-[#64748b] hover:text-[#fff] disabled:opacity-50"
          disabled={editor.historyStack.redos.length === 0}
        >
          Redo
        </button>
        <button
          type="button"
          onClick={() => {
            editor.undo({ scroll: false });
          }}
          className="p-2 text-xs shadow-md hover:bg-[#64748b] hover:text-[#fff] disabled:opacity-50"
          disabled={editor.historyStack.undos.length === 0}
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => {
            const emailContent = editor.getEmail(editor.getEditorValue());
            console.log(emailContent);
          }}
          className="p-2 text-xs shadow-md hover:bg-[#64748b] hover:text-[#fff]"
        >
          Get email content
        </button>
      </div>
    </div>
  );
};
