import Accordion, { AccordionCommands } from '@yoopta/accordion';
import Blockquote from '@yoopta/blockquote';
import Callout from '@yoopta/callout';
import Code from '@yoopta/code';
import Divider from '@yoopta/divider';
// import Mention from '@yoopta/mention';
import { Elements, YooEditor } from '@yoopta/editor';
import Embed from '@yoopta/embed';
import File from '@yoopta/file';
import Headings from '@yoopta/headings';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Lists from '@yoopta/lists';
import Table from '@yoopta/table';

import { uploadToCloudinary } from '../cloudinary';
import Paragraph from '@yoopta/paragraph';
import { OrderDetailsActionPlugin } from '@/components/plugins/email-plugin';
import { SendEmailActionPlugin } from '@/components/plugins/email-action-plugin';
import { StepsPlugin } from '@/components/plugins/steps-plugin';
import { TabsPlugin } from '@/components/plugins/tabs-plugin';

import withShadcnUI from '@yoopta/themes-shadcn';
// import withMaterialUI from '@yoopta/themes-material';
import { ShikiCodePlugin } from '../../components/plugins/code-plugin';

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

export const YOOPTA_PLUGINS = withShadcnUI([
  Accordion.extend({
    allowedPlugins: ALLOWED_PLUGINS,
  }),
  Paragraph,
  Headings.HeadingOne,
  Headings.HeadingTwo,
  Headings.HeadingThree,
  OrderDetailsActionPlugin,
  Blockquote,
  ShikiCodePlugin,
  SendEmailActionPlugin.extend({
    allowedPlugins: ALLOWED_PLUGINS,
  }),
  Lists.BulletedList.extend({
    allowedPlugins: ALLOWED_PLUGINS,
  }),
  Lists.NumberedList.extend({
    allowedPlugins: ALLOWED_PLUGINS,
  }),
  Lists.TodoList.extend({
    allowedPlugins: ALLOWED_PLUGINS,
  }),
  Table.extend({
    allowedPlugins: ALLOWED_PLUGINS,
  }),
  StepsPlugin.extend({
    allowedPlugins: ALLOWED_PLUGINS,
  }),
  TabsPlugin.extend({
    allowedPlugins: ALLOWED_PLUGINS,
  }),
  Link,
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
      onDestroy: (editor: YooEditor, id: string) => {
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
]);
