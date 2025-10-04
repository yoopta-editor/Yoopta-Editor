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
import Table, { TableCommands } from '@yoopta/table';
import Divider from '@yoopta/divider';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

import { uploadToCloudinary } from '@/utils/cloudinary';
import { useEffect, useMemo, useRef } from 'react';
import { initValue } from './initValue';
import { TypographyP } from '@/components/libraries/shadcn/TypographyP';
import { TypographyH1 } from '@/components/libraries/shadcn/TypographyH1';
import { TypographyH2 } from '@/components/libraries/shadcn/TypographyH2';
import { TypographyH3 } from '@/components/libraries/shadcn/TypographyH3';
import { TypographyBlockquote } from '@/components/libraries/shadcn/TypographyBlockquote';
import { TypographyLink } from '@/components/libraries/shadcn/TypographyLink';

import {
  AccordionList,
  AccordionListItem,
  AccordionListItemContent,
  AccordionListItemHeading,
} from '@/components/libraries/shadcn/Accordion';
import { TableRow, Table as TableShadcn, TableDataCell } from '@/components/libraries/shadcn/Table';

const getPlugins = () => [
  Paragraph.extend({
    renders: {
      paragraph: TypographyP,
    },
  }),
  HeadingOne.extend({
    renders: {
      'heading-one': TypographyH1,
    },
  }),
  HeadingTwo.extend({
    renders: {
      'heading-two': TypographyH2,
    },
  }),
  ,
  HeadingThree.extend({
    renders: {
      'heading-three': TypographyH3,
    },
  }),
  ,
  Blockquote.extend({
    renders: {
      blockquote: TypographyBlockquote,
    },
  }),
  Link.extend({
    renders: {
      link: TypographyLink,
    },
  }),
  Accordion.extend({
    renders: {
      'accordion-list': AccordionList,
      'accordion-list-item': AccordionListItem,
      'accordion-list-item-content': AccordionListItemContent,
      'accordion-list-item-heading': AccordionListItemHeading,
    },
  }),
  Table.extend({
    renders: {
      table: TableShadcn,
      'table-row': TableRow,
      'table-data-cell': TableDataCell,
    },
  }),
  NumberedList,
  BulletedList,
  TodoList,
  Divider.extend({
    elementProps: {
      divider: (props) => ({
        ...props,
        color: 'hsl(240 3.7% 15.9%)',
      }),
    },
  }),
  Callout,
  Code,
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

function WithShadcnUILibrary() {
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  const plugins = useMemo(() => getPlugins(), []);

  return (
    <div
      className="md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex justify-center"
      ref={selectionRef}>
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        tools={TOOLS}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        value={initValue}
        autoFocus
      />
    </div>
  );
}

export default WithShadcnUILibrary;
