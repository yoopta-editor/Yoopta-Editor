import Accordion, { AccordionCommands } from '@yoopta/accordion';
import Blockquote from '@yoopta/blockquote';
import Callout from '@yoopta/callout';
import Code from '@yoopta/code';
import Divider from '@yoopta/divider';
// import Mention from '@yoopta/mention';
import { generateId, YooEditor } from '@yoopta/editor';
import Embed from '@yoopta/embed';
import File from '@yoopta/file';
import Headings from '@yoopta/headings';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Lists from '@yoopta/lists';
import Table from '@yoopta/table';
import Tabs from '@yoopta/tabs';
import CodeGroup from '@yoopta/code-group';
import StepsPlugin from '@yoopta/steps';

import { uploadToCloudinary } from '../cloudinary';
import Paragraph from '@yoopta/paragraph';
import { OrderDetailsActionPlugin } from '@/components/plugins/email-plugin';
import { SendEmailActionPlugin } from '@/components/plugins/email-action-plugin';

import withShadcnUI from '@yoopta/themes-shadcn';
// import withMaterialUI from '@yoopta/themes-material';

const YImage = Image.extend({
  options: {
    upload: {
      endpoint: '/api/image-kit-upload',
      method: 'POST',
      maxSize: 5 * 1024 * 1024,
      accept: 'image/jpeg, image/jpg, image/png, image/webp',
    },
    delete: {
      endpoint: '/api/image-kit-delete',
      method: 'DELETE',
    },
  },
});

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
  YImage,
  Code,
];

export const YOOPTA_PLUGINS = withShadcnUI([
  Accordion.extend({
    allowedPlugins: ALLOWED_PLUGINS,
    lifecycle: {
      beforeCreate: (editor: YooEditor) => {
        return AccordionCommands.buildAccordionElements(editor, { items: 2 });
      },
    },
  }),
  Paragraph,
  Tabs.extend({
    allowedPlugins: ALLOWED_PLUGINS,
  }),
  CodeGroup,
  Headings.HeadingOne,
  Headings.HeadingTwo,
  Headings.HeadingThree,
  OrderDetailsActionPlugin,
  Code,
  Blockquote,
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
  StepsPlugin,
  Link,
  Callout.extend({
    allowedPlugins: [
      Lists.BulletedList,
      Lists.NumberedList,
      Lists.TodoList,
      Blockquote,
      Callout,
      YImage,
      Code,
    ],
  }),
  YImage,
]);
