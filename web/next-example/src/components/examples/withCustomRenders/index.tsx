import YooptaEditor, {
  createYooptaEditor,
  PluginElementRenderProps,
  useBlockData,
} from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Divider from '@yoopta/divider';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

import { uploadToCloudinary } from '@/utils/cloudinary';
import { useEffect, useMemo, useRef } from 'react';
import { WITH_CUSTOM_RENDERS_INIT_VALUE } from './initValue';

import NextImage, { ImageProps } from 'next/image';
import NextLink from 'next/link';
import Typography from '@mui/material/Typography';

const getPlugins = () => [
  Paragraph,
  Table,
  Divider,
  HeadingOne,
  HeadingTwo.extend({
    renders: {
      'heading-two': ({ attributes, children }) => {
        return (
          <Typography variant="h2" {...attributes}>
            {children}
          </Typography>
        );
      },
    },
  }),
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link.extend({
    renders: {
      link: ({ attributes, children, element }) => {
        if (element.props.target === '_blank') {
          return (
            <a
              {...attributes}
              className="link-element-extended text-blue-500 hover:underline"
              href={element.props.url}
              target={element.props.target}
              rel="noreferrer noopener">
              {children}
            </a>
          );
        }

        return (
          <NextLink
            {...attributes}
            className="link-element-extended text-blue-500 hover:underline cursor-pointer"
            href={element.props.url}
            target={element.props.target}
            rel={element.props.rel}>
            {children}
          </NextLink>
        );
      },
    },
  }),
  Embed,
  Image.extend({
    renders: {
      image: (props: PluginElementRenderProps) => {
        const { children, element, blockId, attributes } = props;
        const block = useBlockData(blockId);
        const isFill = element.props.fit === 'fill';

        const imageProps: Pick<ImageProps, 'fill' | 'style' | 'width' | 'height'> = {
          fill: isFill,
          style: {
            objectFit: isFill ? 'cover' : 'contain',
          },
        };

        if (!imageProps.fill) {
          imageProps.width = element.props.sizes.width;
          imageProps.height = element.props.sizes.height;
          imageProps.style!.width = element.props.sizes.width;
          imageProps.style!.height = element.props.sizes.height;
        }

        return (
          <div contentEditable={false} {...attributes}>
            <NextImage
              draggable={false}
              src={element.props.src}
              alt={element.props.alt}
              // If image is first, set priority to true because LCP
              priority={block.meta.order === 0}
              objectFit={element.props.fit}
              {...imageProps}
            />
            {children}
          </div>
        );
      },
    },
    options: {
      maxSizes: { maxHeight: 750, maxWidth: 750 },
      async onUpload(file) {
        const data = await uploadToCloudinary(file, 'image');

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
  Video.extend({
    options: {
      onUpload: async (file) => {
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
      onUploadPoster: async (file) => {
        const image = await uploadToCloudinary(file, 'image');
        return image.secure_url;
      },
    },
  }),
  File.extend({
    options: {
      onUpload: async (file) => {
        const response = await uploadToCloudinary(file, 'auto');
        return {
          src: response.secure_url,
          format: response.format,
          name: response.name,
          size: response.bytes,
        };
      },
    },
  }),
];

const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

function WithCustomRenders() {
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  return (
    <div
      className="md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex justify-center"
      ref={selectionRef}>
      <YooptaEditor
        editor={editor}
        plugins={getPlugins()}
        tools={TOOLS}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        value={WITH_CUSTOM_RENDERS_INIT_VALUE}
        autoFocus
      />
    </div>
  );
}

export default WithCustomRenders;
