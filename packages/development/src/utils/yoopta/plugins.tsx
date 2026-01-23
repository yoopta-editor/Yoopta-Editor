import Accordion, { AccordionCommands } from '@yoopta/accordion';
import Blockquote from '@yoopta/blockquote';
import Callout from '@yoopta/callout';
import { Code, CodeGroup } from '@yoopta/code';
import Divider from '@yoopta/divider';
// import Mention from '@yoopta/mention';
import { YooEditor } from '@yoopta/editor';
import Embed from '@yoopta/embed';
import File from '@yoopta/file';
import Headings from '@yoopta/headings';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Lists from '@yoopta/lists';
import Table from '@yoopta/table';
import Tabs from '@yoopta/tabs';
import StepsPlugin from '@yoopta/steps';
import CarouselPlugin from '@yoopta/carousel';

import Paragraph from '@yoopta/paragraph';
import { OrderDetailsActionPlugin } from '@/components/plugins/email-plugin';
import { SendEmailActionPlugin } from '@/components/plugins/email-action-plugin';

import applyTheme from '@yoopta/themes-shadcn';
// import applyTheme from '@yoopta/themes-material';

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
    delete: {
      endpoint: '/api/image-kit-delete',
      method: 'DELETE',
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
  Accordion.extend({
    injectElementsFromPlugins: PLUGIN_ELEMENTS_TO_INJECT,
    lifecycle: {
      beforeCreate: (editor: YooEditor) => {
        return AccordionCommands.buildAccordionElements(editor, { items: 2 });
      },
    },
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
  Paragraph,
  Tabs.extend({
    injectElementsFromPlugins: PLUGIN_ELEMENTS_TO_INJECT,
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
    injectElementsFromPlugins: PLUGIN_ELEMENTS_TO_INJECT,
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

const STEPS_ELEMENTS = [
  {
    id: 'aec50233-8a66-4686-8404-6a94966f0212',
    type: 'step-container',
    children: [
      {
        id: '3809d2f7-23de-4914-98e3-678b5f60155f',
        type: 'step-list',
        children: [
          {
            id: 'b03c2ccd-cc04-4580-8676-84008fe72d81',
            type: 'step-list-item',
            children: [
              {
                id: 'eedd0090-725f-459b-badd-7ca1ae078cba',
                type: 'step-list-item-heading',
                children: [
                  {
                    text: 'Step 1',
                  },
                ],
                props: {
                  nodeType: 'block',
                },
              },
              {
                id: 'a790dec5-5fc7-4cd9-b856-db8d3c67c670',
                type: 'step-list-item-content',
                children: [
                  {
                    id: '43d94fa6-a740-44d4-ac26-e7f4268f1ac4',
                    type: 'heading-two',
                    children: [
                      {
                        text: 'adadasdasd',
                      },
                    ],
                    props: {
                      withAnchor: false,
                    },
                  },
                ],
                props: {
                  nodeType: 'block',
                },
              },
            ],
            props: {
              nodeType: 'block',
              order: 0,
            },
          },
          {
            id: 'e69948c0-6824-4066-a91f-6aca3ec758a1',
            type: 'step-list-item',
            children: [
              {
                id: 'c384a78c-2f59-43aa-8e33-49f090b91c65',
                type: 'step-list-item-heading',
                children: [
                  {
                    text: 'Step 2',
                  },
                ],
                props: {
                  nodeType: 'block',
                },
              },
              {
                id: '46761f01-e676-41e6-8b80-e4769a26014d',
                type: 'step-list-item-content',
                children: [
                  {
                    text: 'Step 2 content',
                  },
                ],
                props: {
                  nodeType: 'block',
                },
              },
            ],
            props: {
              nodeType: 'block',
              order: 1,
            },
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    props: {
      nodeType: 'block',
    },
  },
];
