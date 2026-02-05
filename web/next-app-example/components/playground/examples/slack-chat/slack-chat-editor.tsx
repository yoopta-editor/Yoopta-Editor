"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import YooptaEditor, {
  createYooptaEditor,
  SlateElement,
  YooptaPlugin,
  Blocks,
  Marks,
} from "@yoopta/editor";

import { SLACK_PLUGINS } from "./plugins";
import { SLACK_MARKS } from "./marks";
import { applyTheme } from "@yoopta/themes-shadcn";
import { MentionDropdown } from "@yoopta/themes-shadcn/mention";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Send,
  Bold,
  Italic,
  Strikethrough,
  Code,
  ListOrdered,
  List,
  AtSign,
  Smile,
  Paperclip,
  MessageSquare,
  MoreHorizontal,
  Underline,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { INITIAL_MESSAGES, Message, SLATE_EDITOR_INITIAL_VALUE } from "./initialValue";
import { withMentions } from "@yoopta/mention";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function MessageBubble({ message }: { message: Message }) {
  const previewEditor = useMemo(() => {
    return withMentions(createYooptaEditor({
      plugins: applyTheme(SLACK_PLUGINS) as unknown as YooptaPlugin<
        Record<string, SlateElement>,
        unknown
      >[],
      marks: SLACK_MARKS,
      readOnly: true,
    }));
  }, []);

  useEffect(() => {
    previewEditor.setEditorValue(message.content);
  }, [previewEditor, message.content]);

  return (
    <div className="group flex gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors">
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-xs sm:text-sm font-semibold text-white",
          message.author.isOnline
            ? "bg-gradient-to-br from-green-500 to-emerald-600"
            : "bg-gradient-to-br from-neutral-400 to-neutral-500"
        )}
      >
        {message.author.avatar}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 overflow-hidden">
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

      {/* Hover actions - visible on hover desktop, always on mobile for touch */}
      <div className="flex items-start gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
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

const EDITOR_STYLES = {
  width: "100%",
  paddingBottom: 50,
};

export function SlackChatEditor() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const editor = useMemo(() => {
    return withMentions(createYooptaEditor({
      plugins: applyTheme(SLACK_PLUGINS) as unknown as YooptaPlugin<
        Record<string, SlateElement>,
        unknown
      >[],
      marks: SLACK_MARKS,
      value: SLATE_EDITOR_INITIAL_VALUE
    }));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
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
    editor.setEditorValue(null);
  }

  useEffect(() => {
    const handleKeyDown =
      (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Formatting toolbar actions
  const toggleBold = () => Marks.toggle(editor, { type: "bold" });
  const toggleItalic = () => Marks.toggle(editor, { type: "italic" });
  const toggleUnderline = () => Marks.toggle(editor, { type: "underline" });
  const toggleStrike = () => Marks.toggle(editor, { type: "strike" });
  const toggleCode = () => Marks.toggle(editor, { type: "code" });

  const toggleToBulletedList = () => {
    Blocks.toggleBlock(editor, "BulletedList", { focus: true });
  };

  const toggleToNumberedList = () => {
    Blocks.toggleBlock(editor, "NumberedList", { focus: true });
  };

  const toggleToCodeBlock = () => {
    Blocks.toggleBlock(editor, "Code", { focus: true });
  };

  const toggleBlockquote = () => Blocks.toggleBlock(editor, "Blockquote", { focus: true });

  return (
    <div className="flex flex-1 min-h-0 bg-white dark:bg-neutral-950 justify-center">
      <div className="flex-1 flex flex-col w-full max-w-2xl min-w-0 items-center">

        {/* Messages area */}
        <ScrollArea className="flex-1 min-h-0 w-full">
          <div className="py-3 sm:py-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message composer */}
        <div className="w-full flex-shrink-0 p-3 sm:p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden">
            {/* Formatting toolbar - scroll horizontally on narrow screens */}
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto">
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
                onClick={toggleUnderline}
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
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
                onClick={toggleToBulletedList}
                title="Bulleted list"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleToNumberedList}
                title="Numbered list"
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
              <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleBlockquote}
                title="Blockquote"
              >
                <Quote className="w-4 h-4" />
              </Button>
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
                onClick={toggleToCodeBlock}
                title="Code block"
              >
                <span className="text-xs font-mono">{"{}"}</span>
              </Button>
            </div>

            <div className="min-h-[72px] sm:min-h-[80px] max-h-[180px] sm:max-h-[200px] overflow-auto px-3 py-2">
              <YooptaEditor
                editor={editor}
                style={EDITOR_STYLES}
                placeholder={`Message #yoopta-editor`}
              >
                <MentionDropdown />
              </YooptaEditor>
            </div>

            <div className="flex items-center justify-between gap-2 px-2 py-1.5 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-0.5 min-w-0 overflow-x-auto">
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
                onClick={sendMessage}
                className="bg-[#007A5A] hover:bg-[#148567] text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-neutral-500 mt-1.5 sm:mt-2 text-center px-1">
            <span className="hidden xs:inline">Press </span><kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] sm:text-xs">Enter</kbd> to send<span className="hidden sm:inline">, <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">Shift+Enter</kbd> for new line</span>
          </p>
        </div>
      </div>
    </div>
  );
}
