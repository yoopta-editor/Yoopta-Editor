import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Accordion from '@yoopta/accordion';
import Divider from '@yoopta/divider';
import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Callout from '@yoopta/callout';
import Link from '@yoopta/link';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Tabs from '@yoopta/tabs';
import Steps from '@yoopta/steps';
import Carousel from '@yoopta/carousel';

import applyTheme from '@yoopta/themes-shadcn';

import { uploadToCloudinary } from "../utils/cloudinary";

const YImage = Image.extend({
  options: {
    upload: async (file) => {
      const data = await uploadToCloudinary(file, 'image');

      return {
        id: data.public_id,
        src: data.secure_url,
        alt: 'cloudinary',
        sizes: {
          width: data.width,
          height: data.height,
        },
      };
    },
    delete: async (element) => {
      // await deleteFromCloudinary(element);
    },
  },
})

export const plugins = applyTheme([
  File.extend({
    options: {
      onUpload: async (file) => {
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
  Code.Code,
  Code.CodeGroup,
  Table,
  Accordion,
  Divider,
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  Link,
  NumberedList,
  BulletedList,
  TodoList,
  Embed,
  YImage,
  Video.extend({
    options: {
      upload: async (file) => {
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
    },
  }),
  Steps,
  Carousel.extend({
    injectElementsFromPlugins: [YImage]
  }),
  Tabs,
]);