import Accordion from '@yoopta/accordion';
import Blockquote from '@yoopta/blockquote';
import Callout from '@yoopta/callout';
import { Code, CodeGroup } from '@yoopta/code';
import Divider from '@yoopta/divider';
import Mention, { MentionTrigger } from '@yoopta/mention';
import Embed from '@yoopta/embed';
import File from '@yoopta/file';
import Video, { VideoElement } from '@yoopta/video';
import Headings from '@yoopta/headings';
import Image, { ImageElement } from '@yoopta/image';
import Link from '@yoopta/link';
import Lists from '@yoopta/lists';
import Table from '@yoopta/table';
import Tabs from '@yoopta/tabs';
import StepsPlugin from '@yoopta/steps';
import CarouselPlugin from '@yoopta/carousel';
import TableOfContents from '@yoopta/table-of-contents';

import Paragraph from '@yoopta/paragraph';
import { OrderDetailsActionPlugin } from '@/components/plugins/email-plugin';
import { SendEmailActionPlugin } from '@/components/plugins/email-action-plugin';

import { applyTheme } from '@yoopta/themes-shadcn';

const YImage = Image.extend({
  options: {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const request = await fetch('/api/image-kit-upload', {
        method: 'POST',
        body: formData,
      });
      const result = await request.json();
      return {
        id: result.fileId,
        src: result.url,
        width: result.width,
        height: result.height,
      }
    },
    delete: (element: ImageElement) => {
      return fetch(`/api/image-kit-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: element.props?.id,
        }),
      });
    },
  },
});

const PLUGIN_ELEMENTS_TO_INJECT = [
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

export const YOOPTA_PLUGINS = applyTheme([
  TableOfContents,
  Mention.extend({
    options: {
      triggers: [{ char: '@', type: 'user' }, { char: '#', type: 'page' }],
      // fetch to placeholder json
      onSearch: async (query: string, trigger: MentionTrigger) => {
        if (trigger.type === 'page') {
          const response = await fetch('https://jsonplaceholder.typicode.com/posts');
          const data = await response.json();
          return data.map((post: any) => ({
            id: post.id,
            name: post.title,
            avatar: 'https://media.licdn.com/dms/image/v2/C4D03AQHVZio6kLxs2A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1583328683293?e=1770854400&v=beta&t=TdF5ICElVP7SV8RhbM44pCt0hI8WXdhHdSAak-hGc-g',
            meta: {
              description: post.body,
              url: 'https://www.google.com',
              email: post.email,
            },
          })).filter((post: any) => post.name.toLowerCase().includes(query.toLowerCase()));
        } else {
          const response = await fetch('https://jsonplaceholder.typicode.com/users');
          const data = await response.json();
          return data.map((user: any) => ({
            id: user.id,
            name: user.name,
            avatar: 'https://media.licdn.com/dms/image/v2/C4D03AQHVZio6kLxs2A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1583328683293?e=1770854400&v=beta&t=TdF5ICElVP7SV8RhbM44pCt0hI8WXdhHdSAak-hGc-g',
            meta: {
              description: user.email,
              url: 'https://www.google.com',
              email: user.email,
            },
          })).filter((user: any) => user.name.toLowerCase().includes(query.toLowerCase()));
        }
      },
    }
  }),
  Embed,
  Accordion.extend({
    injectElementsFromPlugins: PLUGIN_ELEMENTS_TO_INJECT,
  }),
  File.extend({
    options: {
      upload: async (file: File) => {
        return {
          id: file.name,
          src: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          format: file.name.split('.').pop(),
        };
      },
    }
  }),
  Divider,
  CarouselPlugin.extend({
    injectElementsFromPlugins: [
      YImage,
      Callout,
      Lists.BulletedList,
      Lists.NumberedList,
      Lists.TodoList,
      Blockquote,
      Code,
    ],
  }),
  Video.extend({
    options: {
      upload: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const request = await fetch('/api/video-kit-upload', {
          method: 'POST',
          body: formData,
        });
        const result = await request.json();

        return {
          id: result.fileId,
          src: result.url,
          width: result.width,
          height: result.height,
        }
      },
      delete: (element: VideoElement) => {
        if (!!element.props?.provider) {
          return Promise.resolve();
        }

        return fetch(`/api/video-kit-delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileId: element.props?.id,
          }),
        });
      },
    }
  }),
  Paragraph,
  Tabs.extend({
    injectElementsFromPlugins: [Code, Lists.BulletedList, Lists.NumberedList, Lists.TodoList],
  }),
  CodeGroup,
  Headings.HeadingOne,
  Headings.HeadingTwo,
  Headings.HeadingThree,
  OrderDetailsActionPlugin,
  Code,
  Blockquote,
  SendEmailActionPlugin.extend({
    injectElementsFromPlugins: PLUGIN_ELEMENTS_TO_INJECT,
  }),
  Lists.BulletedList.extend({
    injectElementsFromPlugins: PLUGIN_ELEMENTS_TO_INJECT,
  }),
  Lists.NumberedList.extend({
    injectElementsFromPlugins: PLUGIN_ELEMENTS_TO_INJECT,
  }),
  Lists.TodoList.extend({
    injectElementsFromPlugins: PLUGIN_ELEMENTS_TO_INJECT,
  }),
  Table.extend({
    injectElementsFromPlugins: PLUGIN_ELEMENTS_TO_INJECT,
  }),
  StepsPlugin.extend({
    injectElementsFromPlugins: [Code],
  }),
  Link,
  Callout.extend({
    injectElementsFromPlugins: [
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
