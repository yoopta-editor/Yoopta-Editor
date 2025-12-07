import Accordion, { AccordionCommands } from '@yoopta/accordion';
import Blockquote from '@yoopta/blockquote';
import type { CalloutElement } from '@yoopta/callout';
import Callout from '@yoopta/callout';
import Code from '@yoopta/code';
import Divider from '@yoopta/divider';
// import Mention from '@yoopta/mention';
import { Elements } from '@yoopta/editor';
import Embed from '@yoopta/embed';
import File from '@yoopta/file';
import Headings from '@yoopta/headings';
import type { ImageElementProps } from '@yoopta/image';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Lists, { TodoListElement } from '@yoopta/lists';
import Table, { TableCommands } from '@yoopta/table';
import type { VideoElementProps } from '@yoopta/video';
import Video from '@yoopta/video';

import { uploadToCloudinary } from '../cloudinary';
import Paragraph from '@yoopta/paragraph';
import { OrderDetailsActionPlugin } from '@/components/plugins/email-plugin';
import { SendEmailActionPlugin } from '@/components/plugins/email-action-plugin';
import { StepsPlugin } from '@/components/plugins/steps-plugin';
import { TabsPlugin } from '@/components/plugins/tabs-plugin';

import { AccordionUI, TableUI, HeadingsUI } from '@yoopta/themes-shadcn';

const ALLOWED_PLUGINS = [
  Paragraph,
  Headings.HeadingOne,
  Headings.HeadingTwo,
  Headings.HeadingThree,
  Lists.BulletedList,
  Lists.NumberedList,
  Lists.TodoList,
  Blockquote,
  Callout,
  Image,
];

export const YOOPTA_PLUGINS = [
  Accordion.extend({
    allowedPlugins: ALLOWED_PLUGINS,
    elements: AccordionUI,
  }),
  Paragraph,
  Headings.HeadingOne.extend({
    elements: HeadingsUI.HeadingOne,
  }),
  Headings.HeadingTwo.extend({
    elements: HeadingsUI.HeadingTwo,
  }),
  Headings.HeadingThree.extend({
    elements: HeadingsUI.HeadingThree,
  }),
  OrderDetailsActionPlugin,
  Blockquote,
  SendEmailActionPlugin.extend({
    allowedPlugins: ALLOWED_PLUGINS,
  }),
  Lists.BulletedList,
  Lists.NumberedList,
  Lists.TodoList,
  Table.extend({
    allowedPlugins: ALLOWED_PLUGINS,
    elements: TableUI,
  }),
  Link,
  StepsPlugin.extend({
    allowedPlugins: ALLOWED_PLUGINS,
  }),
  TabsPlugin,
  Callout.extend({
    allowedPlugins: [
      Lists.BulletedList,
      Lists.NumberedList,
      Lists.TodoList,
      Blockquote,
      Callout,
      Image,
    ],
  }),
  Image.extend({
    events: {
      onDestroy: (editor, id) => {
        const imageElement = Elements.getElement(editor, id, { type: 'image' });
        console.log('Image imageElement', imageElement);
      },
    },
    options: {
      maxSizes: { maxHeight: 750, maxWidth: 750 },
      onUpload: async (file: File) => {
        const data = await uploadToCloudinary(file, 'image');

        return {
          src: data.secure_url,
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
    },
  }),
];
