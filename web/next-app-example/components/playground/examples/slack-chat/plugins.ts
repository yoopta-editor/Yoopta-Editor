import Code from "@yoopta/code";
import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Link from "@yoopta/link";
import { NumberedList, BulletedList } from "@yoopta/lists";
import Image from "@yoopta/image";
import Mention from "@yoopta/mention";
import { CHANNELS } from "./initialValue";

// Slack-like editor with minimal plugins for chat
export const SLACK_PLUGINS = [
  Paragraph,
  Link,
  NumberedList,
  BulletedList,
  Code.Code,
  Blockquote,
  Image,
  Mention.extend({
    options: {
      triggers: [{ char: "#", type: "channel" }],
      onSearch: async (query) => {
        return CHANNELS.filter((channel) => channel.name.toLowerCase().includes(query.toLowerCase()));
      },
    },
  }),
];
