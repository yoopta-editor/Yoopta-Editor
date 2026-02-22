import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import Divider from "@yoopta/divider";
import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Callout from "@yoopta/callout";
import Link from "@yoopta/link";
import { NumberedList, BulletedList } from "@yoopta/lists";
import Image from "@yoopta/image";
import Emoji from "@yoopta/emoji";

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

// Email-focused plugins - optimized for email composition
export const EMAIL_PLUGINS = [
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Link,
  NumberedList,
  BulletedList,
  Blockquote,
  Callout,
  Divider,
  YImage,
  Emoji,
];
