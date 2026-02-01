"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import YooptaEditor, {
  createYooptaEditor,
  SlateElement,
  YooptaContentValue,
  YooptaPlugin,
  Blocks,
  Marks,
} from "@yoopta/editor";

import { SLACK_PLUGINS } from "./plugins";
import { SLACK_MARKS } from "./marks";
import { applyTheme } from "@yoopta/themes-shadcn";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Hash,
  Plus,
  Send,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  ListOrdered,
  List,
  AtSign,
  Smile,
  Paperclip,
  ChevronDown,
  MessageSquare,
  Headphones,
  Settings,
  Search,
  Bell,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
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

interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
  unread?: number;
}

const CHANNELS: Channel[] = [
  { id: "general", name: "general", isPrivate: false },
  { id: "random", name: "random", isPrivate: false, unread: 3 },
  { id: "engineering", name: "engineering", isPrivate: false },
  { id: "design", name: "design", isPrivate: false },
  { id: "announcements", name: "announcements", isPrivate: true },
  { id: "yoopta-editor", name: "yoopta-editor", isPrivate: false, unread: 12 },
];

const DIRECT_MESSAGES = [
  { id: "dm1", name: "John Doe", isOnline: true, avatar: "JD" },
  { id: "dm2", name: "Jane Smith", isOnline: true, avatar: "JS" },
  { id: "dm3", name: "Mike Johnson", isOnline: false, avatar: "MJ" },
];

const INITIAL_MESSAGES: Message[] = [
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

const SLATE_EDITOR_INITIAL_VALUE: YooptaContentValue = {
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

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function MessageBubble({ message }: { message: Message }) {
  const previewEditor = useMemo(() => {
    return createYooptaEditor({
      plugins: applyTheme(SLACK_PLUGINS) as unknown as YooptaPlugin<
        Record<string, SlateElement>,
        unknown
      >[],
      marks: SLACK_MARKS,
      readOnly: true,
    });
  }, []);

  useEffect(() => {
    previewEditor.setEditorValue(message.content);
  }, [previewEditor, message.content]);

  return (
    <div className="group flex gap-3 px-5 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors">
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold text-white",
          message.author.isOnline
            ? "bg-gradient-to-br from-green-500 to-emerald-600"
            : "bg-gradient-to-br from-neutral-400 to-neutral-500"
        )}
      >
        {message.author.avatar}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-neutral-900 dark:text-white text-sm">
            {message.author.name}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Message content rendered with Yoopta */}
        <div className="mt-0.5 text-sm text-neutral-800 dark:text-neutral-200">
          <YooptaEditor
            editor={previewEditor}
            style={{ width: "100%" }}
          />
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map((reaction, idx) => (
              <button
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition-colors"
              >
                <span>{reaction.emoji}</span>
                <span className="text-neutral-600 dark:text-neutral-400">
                  {reaction.count}
                </span>
              </button>
            ))}
            <button className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Smile className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Thread indicator */}
        {message.threadCount && (
          <button className="flex items-center gap-1 mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
            <MessageSquare className="w-3 h-3" />
            {message.threadCount} replies
          </button>
        )}
      </div>

      {/* Hover actions */}
      <div className="flex items-start gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Smile className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MessageSquare className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function SlackChatEditor() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [activeChannel, setActiveChannel] = useState("yoopta-editor");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const editor = useMemo(() => {
    return createYooptaEditor({
      plugins: applyTheme(SLACK_PLUGINS) as unknown as YooptaPlugin<
        Record<string, SlateElement>,
        unknown
      >[],
      marks: SLACK_MARKS,
    });
  }, []);

  useEffect(() => {
    editor.setEditorValue(SLATE_EDITOR_INITIAL_VALUE);
  }, [editor]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    const content = editor.getEditorValue();
    const plainText = editor.getPlainText(content);

    if (!plainText.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      author: { name: "You", avatar: "YO", isOnline: true },
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    editor.setEditorValue(SLATE_EDITOR_INITIAL_VALUE);
  }, [editor]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Formatting toolbar actions
  const toggleBold = () => Marks.toggle(editor, { type: "bold" });
  const toggleItalic = () => Marks.toggle(editor, { type: "italic" });
  const toggleStrike = () => Marks.toggle(editor, { type: "strike" });
  const toggleCode = () => Marks.toggle(editor, { type: "code" });

  const insertBulletedList = () => {
    Blocks.insertBlock(editor, "BulletedList", { focus: true });
  };

  const insertNumberedList = () => {
    Blocks.insertBlock(editor, "NumberedList", { focus: true });
  };

  const insertCodeBlock = () => {
    Blocks.insertBlock(editor, "Code", { focus: true });
  };

  return (
    <div className="flex flex-1 bg-white dark:bg-neutral-950">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-[#3F0E40] dark:bg-[#1a1d21] flex flex-col">
        {/* Workspace header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
          <button className="flex items-center gap-1 text-white font-semibold text-lg hover:bg-white/10 rounded px-2 py-1 transition-colors">
            Yoopta Workspace
            <ChevronDown className="w-4 h-4" />
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <div className="py-3">
            {/* Quick links */}
            <div className="px-3 space-y-0.5">
              <button className="w-full flex items-center gap-2 px-2 py-1.5 text-white/80 hover:bg-white/10 rounded text-sm transition-colors">
                <MessageSquare className="w-4 h-4" />
                Threads
              </button>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 text-white/80 hover:bg-white/10 rounded text-sm transition-colors">
                <Headphones className="w-4 h-4" />
                Huddles
              </button>
            </div>

            {/* Channels */}
            <div className="mt-4">
              <button className="w-full flex items-center justify-between px-3 py-1 text-white/60 hover:text-white/80 text-sm transition-colors">
                <div className="flex items-center gap-1">
                  <ChevronDown className="w-3 h-3" />
                  <span>Channels</span>
                </div>
                <Plus className="w-4 h-4" />
              </button>
              <div className="mt-1 space-y-0.5 px-2">
                {CHANNELS.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-colors",
                      activeChannel === channel.id
                        ? "bg-[#1264A3] text-white"
                        : "text-white/80 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-4 h-4" />
                      <span>{channel.name}</span>
                    </div>
                    {channel.unread && (
                      <span className="px-1.5 py-0.5 rounded bg-red-500 text-white text-xs font-medium">
                        {channel.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Messages */}
            <div className="mt-4">
              <button className="w-full flex items-center justify-between px-3 py-1 text-white/60 hover:text-white/80 text-sm transition-colors">
                <div className="flex items-center gap-1">
                  <ChevronDown className="w-3 h-3" />
                  <span>Direct messages</span>
                </div>
                <Plus className="w-4 h-4" />
              </button>
              <div className="mt-1 space-y-0.5 px-2">
                {DIRECT_MESSAGES.map((dm) => (
                  <button
                    key={dm.id}
                    className="w-full flex items-center gap-2 px-2 py-1 text-white/80 hover:bg-white/10 rounded text-sm transition-colors"
                  >
                    <div className="relative">
                      <div className="w-5 h-5 rounded bg-neutral-500 flex items-center justify-center text-[10px] text-white">
                        {dm.avatar}
                      </div>
                      {dm.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border border-[#3F0E40] dark:border-[#1a1d21]" />
                      )}
                    </div>
                    <span>{dm.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Channel header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-neutral-500" />
            <span className="font-semibold text-lg text-neutral-900 dark:text-white">
              {activeChannel}
            </span>
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1">
          <div className="py-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message composer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden">
            {/* Formatting toolbar */}
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-neutral-200 dark:border-neutral-800">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleBold}
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleItalic}
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleStrike}
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </Button>
              <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={insertBulletedList}
                title="Bulleted list"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={insertNumberedList}
                title="Numbered list"
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
              <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleCode}
                title="Inline code"
              >
                <Code className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={insertCodeBlock}
                title="Code block"
              >
                <span className="text-xs font-mono">{"{}"}</span>
              </Button>
            </div>

            {/* Editor area */}
            <div className="min-h-[80px] max-h-[200px] overflow-auto px-3 py-2">
              <YooptaEditor
                editor={editor}
                style={{ width: "100%" }}
                placeholder={`Message #${activeChannel}`}
              />
            </div>

            {/* Bottom toolbar */}
            <div className="flex items-center justify-between px-2 py-1.5 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <AtSign className="w-4 h-4" />
                </Button>
              </div>
              <Button
                size="sm"
                onClick={handleSendMessage}
                className="bg-[#007A5A] hover:bg-[#148567] text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-2 text-center">
            Press <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}
