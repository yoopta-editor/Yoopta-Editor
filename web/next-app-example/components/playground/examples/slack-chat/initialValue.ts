import { YooptaContentValue } from "@yoopta/editor";

export type Message = {
  id: string;
  author: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  content: YooptaContentValue;
  timestamp: Date;
  reactions?: { emoji: string; count: number; users: string[] }[];
  threadCount?: number;
}

export type Channel = {
  id: string;
  name: string;
  isPrivate: boolean;
  unread?: number;
}

export const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    author: { name: "Sarah Chen", avatar: "SC", isOnline: true },
    content: {
      "block-1": {
        id: "block-1",
        type: "Paragraph",
        value: [
          {
            id: "el-1",
            type: "paragraph",
            children: [
              { text: "Hey team! " },
              { text: "Yoopta Editor v6", bold: true },
              { text: " is looking amazing! The new API is so much cleaner." },
            ],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 0, depth: 0 },
      },
    },
    timestamp: new Date(Date.now() - 3600000 * 2),
    reactions: [
      { emoji: "🎉", count: 5, users: ["John", "Jane", "Mike", "Alex", "Chris"] },
      { emoji: "👍", count: 3, users: ["John", "Jane", "Mike"] },
    ],
    threadCount: 4,
  },
  {
    id: "2",
    author: { name: "Alex Rivera", avatar: "AR", isOnline: true },
    content: {
      "block-1": {
        id: "block-1",
        type: "Paragraph",
        value: [
          {
            id: "el-1",
            type: "paragraph",
            children: [
              { text: "Totally agree! The " },
              { text: "Blocks", code: true },
              { text: " and " },
              { text: "Marks", code: true },
              { text: " APIs make everything so intuitive." },
            ],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 0, depth: 0 },
      },
    },
    timestamp: new Date(Date.now() - 3600000),
    reactions: [{ emoji: "💯", count: 2, users: ["Sarah", "Mike"] }],
  },
  {
    id: "3",
    author: { name: "Mike Johnson", avatar: "MJ", isOnline: false },
    content: {
      "block-1": {
        id: "block-1",
        type: "Paragraph",
        value: [
          {
            id: "el-1",
            type: "paragraph",
            children: [
              {
                text: "Has anyone tried the new export features? I'm working on integrating it with our email system.",
              },
            ],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 0, depth: 0 },
      },
    },
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: "4",
    author: { name: "Sarah Chen", avatar: "SC", isOnline: true },
    content: {
      "block-1": {
        id: "block-1",
        type: "Paragraph",
        value: [
          {
            id: "el-1",
            type: "paragraph",
            children: [
              { text: "Yes! Check out " },
              { text: "editor.getHTML()", code: true },
              { text: " and " },
              { text: "editor.getMarkdown()", code: true },
              { text: " - they work great!" },
            ],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 0, depth: 0 },
      },
      "block-2": {
        id: "block-2",
        type: "Code",
        value: [
          {
            id: "el-2",
            type: "code",
            children: [
              {
                text: `const html = editor.getHTML(editor.getEditorValue());
const markdown = editor.getMarkdown(editor.getEditorValue());`,
              },
            ],
            props: { nodeType: "void", language: "typescript" },
          },
        ],
        meta: { order: 1, depth: 0 },
      },
    },
    timestamp: new Date(Date.now() - 900000),
    reactions: [
      { emoji: "🙏", count: 1, users: ["Mike"] },
      { emoji: "❤️", count: 2, users: ["Alex", "John"] },
    ],
  },
];

export const SLATE_EDITOR_INITIAL_VALUE: YooptaContentValue = {
  "block-1": {
    id: "block-1",
    type: "Paragraph",
    value: [
      {
        id: "element-1",
        type: "paragraph",
        children: [{ text: "" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 0, depth: 0 },
  },
};


export const CHANNELS: Channel[] = [
  { id: "general", name: "general", isPrivate: false },
  { id: "random", name: "random", isPrivate: false, unread: 3 },
  { id: "engineering", name: "engineering", isPrivate: false },
  { id: "design", name: "design", isPrivate: false },
  { id: "announcements", name: "announcements", isPrivate: true },
  { id: "yoopta-editor", name: "yoopta-editor", isPrivate: false, unread: 12 },
];
