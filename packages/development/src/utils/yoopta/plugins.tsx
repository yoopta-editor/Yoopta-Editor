import Blockquote from '@yoopta/blockquote';
import Paragraph from '@yoopta/paragraph';
import Headings from '@yoopta/headings';
import Image, { ImageElementProps } from '@yoopta/image';
import Callout, { CalloutElement } from '@yoopta/callout';
import Lists from '@yoopta/lists';
import Link from '@yoopta/link';
import Video, { VideoElementProps } from '@yoopta/video';
import File from '@yoopta/file';
import Embed from '@yoopta/embed';
import Accordion, { AccordionCommands } from '@yoopta/accordion';
import Code from '@yoopta/code';
import Table, { TableCommands } from '@yoopta/table';
import Divider from '@yoopta/divider';
import Mention from '@yoopta/mention';

import { uploadToCloudinary } from '../cloudinary';
import { Elements } from '@yoopta/editor';

export const YOOPTA_PLUGINS = [
  Mention,
  Table.extend({
    events: {
      onBeforeCreate: (editor) => {
        return TableCommands.buildTableElements(editor, { rows: 3, columns: 3 });
      },
    },
    options: {
      display: {
        title: 'Table with Shadcn',
      },
    },
  }),
  Divider.extend({
    elementProps: {
      divider: (props) => ({
        ...props,
        color: '#8383e0',
      }),
    },
  }),
  Accordion.extend({
    events: {
      onBeforeCreate: (editor) => {
        return AccordionCommands.buildAccordionElements(editor, { items: 2, props: { isExpanded: true } });
      },
    },
    elementProps: {
      'accordion-list-item': (props) => {
        return {
          ...props,
          isExpanded: true,
        };
      },
    },
  }),
  File.extend({
    events: {
      onBeforeCreate: (editor) => {
        return editor.commands.buildFileElements({ text: 'Hello world' });
      },
    },
    options: {
      onUpload: async (file: File) => {
        const data = await uploadToCloudinary(file, 'auto');

        return {
          src: data.secure_url,
          format: data.format,
          name: data.name,
          size: data.bytes,
        };
      },
    },
  }),
  Paragraph,
  Image.extend({
    events: {
      onDestroy: (editor, id) => {
        const imageElement = Elements.getElement(editor, id, { type: 'image' });
        console.log('Image imageElement', imageElement);
      },
    },
    elementProps: {
      image: (props: ImageElementProps) => ({
        ...props,
        alt: 'cloudinary',
        sizes: {
          width: 500,
          height: 'auto',
        },
        fit: 'contain',
      }),
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
  Headings.HeadingOne.extend({
    options: {
      // HTMLAttributes: {
      //   className: 'heading-one-element-extended',
      // },
    },
  }),
  Headings.HeadingTwo.extend({
    options: {
      // HTMLAttributes: {
      //   className: 'heading-two-element-extended',
      // },
    },
  }),
  Headings.HeadingThree,
  Blockquote.extend({
    options: {
      // HTMLAttributes: {
      //   className: 'blockquote-element-extended',
      // },
    },
  }),
  Callout.extend({
    elementProps: {
      callout: (props: CalloutElement['props']) => ({
        ...props,
        theme: 'info',
      }),
    },
    options: {
      // HTMLAttributes: {
      //   className: 'callout-element-extended',
      // },
    },
  }),
  Lists.BulletedList.extend({
    options: {
      // HTMLAttributes: {
      //   className: 'bulleted-list-element-extended',
      // },
    },
  }),
  Lists.NumberedList,
  Lists.TodoList.extend({
    options: {
      HTMLAttributes: {
        spellCheck: false,
      },
    },
    // elementProps: {
    //   'todo-list': (props: TodoListElement['props']) => ({
    //     ...props,
    //     checked: true,
    //   }),
    // },
  }),
  Embed,
  Video.extend({
    elementProps: {
      video: (props: VideoElementProps) => ({
        ...props,
        fit: 'contain',
        settings: {
          controls: true,
          loop: true,
          muted: true,
          playsInline: true,
        },
      }),
    },
    options: {
      // HTMLAttributes: {
      //   className: 'video-element-extended',
      // },
      onUploadPoster: async (file: File) => {
        const data = await uploadToCloudinary(file, 'image');
        return data.secure_url;
      },
      onUpload: async (file: File) => {
        const data = await uploadToCloudinary(file, 'video');
        return {
          src: data.secure_url,
          fit: 'cover',
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
    },
  }),
  Link.extend({
    elementProps: {
      link: (props) => ({
        ...props,
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    },
    options: {
      HTMLAttributes: {
        // className: 'link-element',
      },
    },
  }),
  Code.extend({
    elementProps: {
      code: (props) => ({
        ...props,
        language: 'javascript',
        theme: 'GithubDark',
      }),
    },
  }),
];
