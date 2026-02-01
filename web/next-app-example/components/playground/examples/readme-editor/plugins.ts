import { HeadingOne, HeadingThree, HeadingTwo } from "@yoopta/headings";
import Code from "@yoopta/code";
import Table from "@yoopta/table";
import Divider from "@yoopta/divider";
import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Callout from "@yoopta/callout";
import Link from "@yoopta/link";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import Image from "@yoopta/image";

const YImage = Image.extend({
  options: {
    upload: async (file) => {
      return {
        id: file.name,
        src: URL.createObjectURL(file),
        alt: file.name,
        sizes: {
          width: file.size,
          height: file.size,
        },
      };
    },
  },
});

// README-focused plugins - what you'd typically need for documentation
export const README_PLUGINS = [
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Code.Code,
  Table,
  Divider,
  Blockquote,
  Callout,
  Link,
  NumberedList,
  BulletedList,
  TodoList,
  YImage,
];
