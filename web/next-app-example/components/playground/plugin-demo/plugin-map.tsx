'use client';

import type { SlateElement, YooptaPlugin } from '@yoopta/editor';
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
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
import FilePlugin from '@yoopta/file';
import Tabs from '@yoopta/tabs';
import Steps from '@yoopta/steps';
import Carousel from '@yoopta/carousel';
import Mention from '@yoopta/mention';
import TableOfContents from '@yoopta/table-of-contents';

const stubImageUpload = async (file: globalThis.File) => ({
  id: file.name,
  src: URL.createObjectURL(file),
  alt: file.name,
  sizes: { width: 0, height: 0 },
});

const ImageWithUpload = Image.extend({
  options: { upload: stubImageUpload },
});

const FileWithUpload = FilePlugin.extend({
  options: {
    upload: async (file: globalThis.File) => ({
      id: file.name,
      src: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      format: file.name.split('.').pop(),
    }),
  },
});

const VideoWithUpload = Video.extend({
  options: {
    upload: async (file: globalThis.File) => ({
      id: file.name,
      src: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      format: file.name.split('.').pop(),
    }),
  },
});

const CarouselWithImage = Carousel.extend({
  injectElementsFromPlugins: [ImageWithUpload],
});

const MentionStub = Mention.extend({
  options: {
    onSearch: async () => [],
    triggers: [{ char: '@', type: 'user' }],
  },
});

export const PLUGIN_SLUG_TO_PLUGINS = {
  paragraph: [Paragraph],
  headings: [Paragraph, HeadingOne, HeadingTwo, HeadingThree],
  blockquote: [Paragraph, Blockquote],
  code: [Paragraph, Code.Code],
  'code-group': [Paragraph, Code.Code, Code.CodeGroup],
  lists: [Paragraph, BulletedList, NumberedList, TodoList],
  callout: [Paragraph, Callout],
  divider: [Paragraph, Divider],
  table: [Paragraph, Table],
  'table-of-contents': [Paragraph, TableOfContents],
  tabs: [Paragraph, Tabs],
  steps: [Paragraph, Steps],
  accordion: [Paragraph, Accordion],
  image: [Paragraph, ImageWithUpload],
  video: [Paragraph, VideoWithUpload],
  file: [Paragraph, FileWithUpload],
  embed: [Paragraph, Embed],
  carousel: [Paragraph, CarouselWithImage],
  mention: [Paragraph, MentionStub],
  link: [Paragraph, Link],
} as Record<string, YooptaPlugin<Record<string, SlateElement>, unknown>[]>;

export const PLUGIN_SLUGS = Object.keys(PLUGIN_SLUG_TO_PLUGINS);
