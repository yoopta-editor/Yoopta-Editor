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
import Emoji from '@yoopta/emoji';
import File from '@yoopta/file';
import Tabs from '@yoopta/tabs';
import Steps from '@yoopta/steps';
import Carousel from '@yoopta/carousel';
import Mention from '@yoopta/mention';
import TableOfContents from '@yoopta/table-of-contents';

const YImage = Image.extend({
  options: {
    upload: async (file) => {
      return {
        id: file.name,
        src: URL.createObjectURL(file),
        alt: 'cloudinary',
        sizes: {
          width: file.size,
          height: file.size,
        },
      };
    },
  },
})

export const YOOPTA_PLUGINS = [
  TableOfContents,
  File.extend({
    options: {
      upload: async (file) => {
        return {
          id: file.name,
          src: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          format: file.name.split('.').pop(),
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
  HeadingOne.extend({
    elements: {
      'heading-one': {
        placeholder: 'Heading 1',
      },
    },
  }),
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  Link,
  NumberedList,
  BulletedList,
  TodoList,
  Embed,
  Emoji,
  YImage,
  Video.extend({
    options: {
      upload: async (file) => {
        return {
          id: file.name,
          src: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          format: file.name.split('.').pop(),
        };
      },
    },
  }),
  Steps.extend({
    elements: {
      'step-list-item-heading': {
        placeholder: 'Step title',
      },
      'step-list-item-content': {
        placeholder: 'Describe this step...',
      },
    },
  }),
  Carousel.extend({
    injectElementsFromPlugins: [YImage]
  }),
  Tabs,
  Mention.extend({
    options: {
      onSearch: async (query, trigger) => {
        if (trigger.type === 'page') {
          const response = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${query}`);
          const data = await response.json();
          return data.map((post: { id: string; title: string; body: string }) => ({
            id: post.id,
            name: post.title,
            avatar: post.body,
          }));
        }

        const response = await fetch(`https://jsonplaceholder.typicode.com/users?q=${query}`);
        const data = await response.json();
        return data.map((user: { id: string; name: string; avatar: string }) => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        }));
      },
      triggers: [{ char: '@', type: 'user' }, { char: '#', type: 'page' }],
    },
  }),
];