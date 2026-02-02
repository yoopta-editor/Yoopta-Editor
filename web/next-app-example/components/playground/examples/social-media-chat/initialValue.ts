import { YooptaContentValue } from "@yoopta/editor";

export type ChatUser = {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen?: Date;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  content: YooptaContentValue;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  replyTo?: string;
  reactions?: { emoji: string; userIds: string[] }[];
};

export type ChatConversation = {
  id: string;
  participants: ChatUser[];
  messages: ChatMessage[];
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
};

export const CURRENT_USER: ChatUser = {
  id: "me",
  name: "You",
  avatar: "YO",
  status: "online",
};

export const CHAT_USERS: ChatUser[] = [
  {
    id: "alex",
    name: "Alex Chen",
    avatar: "AC",
    status: "online",
  },
  {
    id: "sarah",
    name: "Sarah Miller",
    avatar: "SM",
    status: "online",
  },
  {
    id: "mike",
    name: "Mike Johnson",
    avatar: "MJ",
    status: "away",
    lastSeen: new Date(Date.now() - 1800000),
  },
  {
    id: "emma",
    name: "Emma Wilson",
    avatar: "EW",
    status: "offline",
    lastSeen: new Date(Date.now() - 7200000),
  },
];

export const EMPTY_EDITOR_VALUE: YooptaContentValue = {
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

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: "conv-1",
    participants: [CURRENT_USER, CHAT_USERS[0]],
    isGroup: false,
    messages: [
      {
        id: "msg-1",
        senderId: "alex",
        content: {
          "block-1": {
            id: "block-1",
            type: "Paragraph",
            value: [
              {
                id: "el-1",
                type: "paragraph",
                children: [
                  { text: "Hey! Did you check out that new " },
                  { text: "Yoopta Editor", bold: true },
                  { text: " library? It's amazing for building rich text features!" },
                ],
                props: { nodeType: "block" },
              },
            ],
            meta: { order: 0, depth: 0 },
          },
        },
        timestamp: new Date(Date.now() - 3600000),
        status: "read",
        reactions: [{ emoji: "👍", userIds: ["me"] }],
      },
      {
        id: "msg-2",
        senderId: "me",
        content: {
          "block-1": {
            id: "block-1",
            type: "Paragraph",
            value: [
              {
                id: "el-1",
                type: "paragraph",
                children: [
                  { text: "Yes! I love how it handles " },
                  { text: "code blocks", code: true },
                  { text: " and formatting. Check this out:" },
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
                    text: `const editor = createYooptaEditor({
  plugins: [Paragraph, Code],
  marks: [Bold, Italic]
});`,
                  },
                ],
                props: { nodeType: "void", language: "typescript" },
              },
            ],
            meta: { order: 1, depth: 0 },
          },
        },
        timestamp: new Date(Date.now() - 3000000),
        status: "read",
      },
      {
        id: "msg-3",
        senderId: "alex",
        content: {
          "block-1": {
            id: "block-1",
            type: "Paragraph",
            value: [
              {
                id: "el-1",
                type: "paragraph",
                children: [
                  { text: "That's clean! " },
                  { text: "And the API is so intuitive", italic: true },
                  { text: ". We should use it for our project." },
                ],
                props: { nodeType: "block" },
              },
            ],
            meta: { order: 0, depth: 0 },
          },
        },
        timestamp: new Date(Date.now() - 2400000),
        status: "read",
        reactions: [
          { emoji: "🔥", userIds: ["me"] },
          { emoji: "💯", userIds: ["me"] },
        ],
      },
      {
        id: "msg-4",
        senderId: "me",
        content: {
          "block-1": {
            id: "block-1",
            type: "Paragraph",
            value: [
              {
                id: "el-1",
                type: "paragraph",
                children: [{ text: "Definitely! Here's what I'm thinking:" }],
                props: { nodeType: "block" },
              },
            ],
            meta: { order: 0, depth: 0 },
          },
          "block-2": {
            id: "block-2",
            type: "NumberedList",
            value: [
              {
                id: "el-2",
                type: "numbered-list",
                children: [{ text: "Use Yoopta for the message composer" }],
                props: { nodeType: "block" },
              },
            ],
            meta: { order: 1, depth: 0 },
          },
          "block-3": {
            id: "block-3",
            type: "NumberedList",
            value: [
              {
                id: "el-3",
                type: "numbered-list",
                children: [{ text: "Add support for code snippets and formatting" }],
                props: { nodeType: "block" },
              },
            ],
            meta: { order: 2, depth: 0 },
          },
          "block-4": {
            id: "block-4",
            type: "NumberedList",
            value: [
              {
                id: "el-4",
                type: "numbered-list",
                children: [{ text: "Export messages to HTML for email notifications" }],
                props: { nodeType: "block" },
              },
            ],
            meta: { order: 3, depth: 0 },
          },
        },
        timestamp: new Date(Date.now() - 1800000),
        status: "read",
      },
      {
        id: "msg-5",
        senderId: "alex",
        content: {
          "block-1": {
            id: "block-1",
            type: "Paragraph",
            value: [
              {
                id: "el-1",
                type: "paragraph",
                children: [{ text: "Perfect plan! Let's do it tomorrow 🚀" }],
                props: { nodeType: "block" },
              },
            ],
            meta: { order: 0, depth: 0 },
          },
        },
        timestamp: new Date(Date.now() - 600000),
        status: "read",
      },
    ],
  },
  {
    id: "conv-2",
    participants: [CURRENT_USER, CHAT_USERS[1]],
    isGroup: false,
    messages: [
      {
        id: "msg-s1",
        senderId: "sarah",
        content: {
          "block-1": {
            id: "block-1",
            type: "Paragraph",
            value: [
              {
                id: "el-1",
                type: "paragraph",
                children: [{ text: "The designs are ready! Check the Figma link 🎨" }],
                props: { nodeType: "block" },
              },
            ],
            meta: { order: 0, depth: 0 },
          },
        },
        timestamp: new Date(Date.now() - 86400000),
        status: "read",
      },
    ],
  },
  {
    id: "conv-3",
    participants: [CURRENT_USER, ...CHAT_USERS],
    isGroup: true,
    groupName: "Project Team",
    groupAvatar: "PT",
    messages: [
      {
        id: "msg-g1",
        senderId: "mike",
        content: {
          "block-1": {
            id: "block-1",
            type: "Paragraph",
            value: [
              {
                id: "el-1",
                type: "paragraph",
                children: [{ text: "Team sync at 3pm today! Don't forget 📅" }],
                props: { nodeType: "block" },
              },
            ],
            meta: { order: 0, depth: 0 },
          },
        },
        timestamp: new Date(Date.now() - 43200000),
        status: "read",
      },
    ],
  },
];
