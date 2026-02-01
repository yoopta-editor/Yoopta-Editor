import Code from "@yoopta/code";
import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Link from "@yoopta/link";
import { NumberedList, BulletedList } from "@yoopta/lists";

// Slack-like editor with minimal plugins for chat
export const SLACK_PLUGINS = [
  Paragraph,
  Link,
  NumberedList,
  BulletedList,
  Code.Code,
  Blockquote,
];
