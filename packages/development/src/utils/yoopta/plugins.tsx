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
import { CodeGroupPlugin } from '@/components/plugins/card-group-plugin';
import { StepsPlugin } from '@/components/plugins/steps-plugin';
import { TabsPlugin } from '@/components/plugins/tabs-plugin';

export const YOOPTA_PLUGINS = [
  Accordion.extend({
    // Plugin-level: applies to ALL leaf elements (heading + content)
    allowedPlugins: [
      Paragraph,
      Headings.HeadingOne,
      Headings.HeadingTwo,
      Headings.HeadingThree,
      Lists.BulletedList,
      Blockquote,
      Callout,
    ],
  }),
  Paragraph,
  Headings.HeadingOne,
  Headings.HeadingTwo,
  Headings.HeadingThree,
  OrderDetailsActionPlugin,
  Blockquote,
  SendEmailActionPlugin.extend({
    allowedPlugins: [
      Paragraph,
      Headings.HeadingOne,
      Headings.HeadingTwo,
      Headings.HeadingThree,
      Blockquote,
    ],
  }),
  Lists.BulletedList,
  Lists.NumberedList,
  Lists.TodoList,
  Table.extend({
    allowedPlugins: [Headings.HeadingThree],
  }),
  Link,
  StepsPlugin.extend({
    allowedPlugins: [
      Paragraph,
      Headings.HeadingOne,
      Headings.HeadingTwo,
      Headings.HeadingThree,
      Blockquote,
      Callout,
      Image,
    ],
  }),
  TabsPlugin,
  Callout.extend({
    allowedPlugins: [
      Paragraph,
      Headings.HeadingOne,
      Headings.HeadingTwo,
      Headings.HeadingThree,
      Blockquote,
      Lists.BulletedList,
      Lists.NumberedList,
      Lists.TodoList,
      Table,
      Image,
    ],
  }),
  // CodeGroupPlugin,
  // Mention,
  // Divider.extend({
  //   elementProps: {
  //     divider: (props) => ({
  //       ...props,
  //       color: '#8383e0',
  //     }),
  //   },
  // }),
  // File.extend({
  //   events: {
  //     onBeforeCreate: (editor) => editor.commands.buildFileElements({ text: 'Hello world' }),
  //   },
  //   options: {
  //     onUpload: async (file: File) => {
  //       const data = await uploadToCloudinary(file, 'auto');

  //       return {
  //         src: data.secure_url,
  //         format: data.format,
  //         name: data.name,
  //         size: data.bytes,
  //       };
  //     },
  //   },
  // }),
  Image.extend({
    events: {
      onDestroy: (editor, id) => {
        const imageElement = Elements.getElement(editor, id, { type: 'image' });
        console.log('Image imageElement', imageElement);
      },
    },
    options: {
      maxSizes: { maxHeight: 750, maxWidth: 750 },
      // HTMLAttributes: {
      //   className: 'image-element-extended',
      // },

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
  // Headings.HeadingOne.extend({
  //   options: {
  //     // HTMLAttributes: {
  //     //   className: 'heading-one-element-extended',
  //     // },
  //   },
  // }),
  // Headings.HeadingTwo.extend({
  //   options: {
  //     // HTMLAttributes: {
  //     //   className: 'heading-two-element-extended',
  //     // },
  //   },
  // }),
  // Headings.HeadingThree,
  // Blockquote.extend({
  //   options: {
  //     // HTMLAttributes: {
  //     //   className: 'blockquote-element-extended',
  //     // },
  //   },
  // }),
  // Callout.extend({
  //   elementProps: {
  //     callout: (props: CalloutElement['props']) => ({
  //       ...props,
  //       theme: 'info',
  //     }),
  //   },
  //   options: {
  //     // HTMLAttributes: {
  //     //   className: 'callout-element-extended',
  //     // },
  //   },
  // }),
  // Lists.BulletedList.extend({
  //   options: {
  //     // HTMLAttributes: {
  //     //   className: 'bulleted-list-element-extended',
  //     // },
  //   },
  // }),
  // Lists.NumberedList,
  // Lists.TodoList.extend({
  //   options: {
  //     HTMLAttributes: {
  //       spellCheck: false,
  //     },
  //   },
  //   // elementProps: {
  //   //   'todo-list': (props: TodoListElement['props']) => ({
  //   //     ...props,
  //   //     checked: true,
  //   //   }),
  //   // },
  // }),
  // Embed,
  // Video.extend({
  //   elementProps: {
  //     video: (props: VideoElementProps) => ({
  //       ...props,
  //       fit: 'contain',
  //       settings: {
  //         controls: true,
  //         loop: true,
  //         muted: true,
  //         playsInline: true,
  //       },
  //     }),
  //   },
  //   options: {
  //     // HTMLAttributes: {
  //     //   className: 'video-element-extended',
  //     // },
  //     onUploadPoster: async (file: File) => {
  //       const data = await uploadToCloudinary(file, 'image');
  //       return data.secure_url;
  //     },
  //     onUpload: async (file: File) => {
  //       const data = await uploadToCloudinary(file, 'video');
  //       return {
  //         src: data.secure_url,
  //         fit: 'cover',
  //         sizes: {
  //           width: data.width,
  //           height: data.height,
  //         },
  //       };
  //     },
  //   },
  // }),
  // Link.extend({
  //   elementProps: {
  //     link: (props) => ({
  //       ...props,
  //       target: '_blank',
  //       rel: 'noopener noreferrer',
  //     }),
  //   },
  //   options: {
  //     HTMLAttributes: {
  //       // className: 'link-element',
  //     },
  //   },
  // }),
  // Code.extend({
  //   elementProps: {
  //     code: (props) => ({
  //       ...props,
  //       language: 'javascript',
  //       theme: 'GithubDark',
  //     }),
  //   },
  // }),
];
