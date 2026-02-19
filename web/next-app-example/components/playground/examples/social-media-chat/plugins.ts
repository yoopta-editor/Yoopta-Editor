import Code from "@yoopta/code";
import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Link from "@yoopta/link";
import { NumberedList, BulletedList } from "@yoopta/lists";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import Divider from "@yoopta/divider";
import Image from "@yoopta/image";
import Video from "@yoopta/video";
import Emoji from "@yoopta/emoji";
import File from "@yoopta/file";
import { SlateElement, YooptaPlugin } from "@yoopta/editor";

const ImageWithUpload = Image.extend({
  options: {
    upload: async (file: File) => {
      return {
        id: file.name,
        src: URL.createObjectURL(file),
        alt: file.name,
        sizes: {
          width: 400,
          height: 300,
        },
      };
    },
  },
});

const VideoWithUpload = Video.extend({
  options: {
    upload: async (file: File) => {
      return {
        id: file.name,
        src: URL.createObjectURL(file),
        sizes: {
          width: 400,
          height: 300,
        }
      };
    },
  },
});

const FileWithUpload = File.extend({
  options: {
    upload: async (file: File) => {
      return {
        id: file.name,
        src: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        format: file.name.split(".").pop() || "",
      };
    },
  },
});

// Rich Chat plugins - supports rich content in messages
export const CHAT_PLUGINS = [
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Link,
  NumberedList,
  BulletedList,
  Code.Code,
  Blockquote,
  Divider,
  ImageWithUpload,
  VideoWithUpload,
  FileWithUpload,
  Emoji,
] as unknown as YooptaPlugin<Record<string, SlateElement>, unknown>[];

// Plugins for user input - includes media
export const CHAT_INPUT_PLUGINS = [
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  NumberedList,
  BulletedList,
  Code.Code,
  Blockquote,
  Divider,
  ImageWithUpload,
  VideoWithUpload,
  FileWithUpload,
  Emoji,
] as unknown as YooptaPlugin<Record<string, SlateElement>, unknown>[];
