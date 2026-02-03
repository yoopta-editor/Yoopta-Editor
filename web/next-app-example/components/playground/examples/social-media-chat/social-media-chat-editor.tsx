"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import YooptaEditor, {
  createYooptaEditor,
  SlateElement,
  YooptaPlugin,
  Marks,
  Blocks,
} from "@yoopta/editor";
import { ImageCommands } from "@yoopta/image";
import { VideoCommands } from "@yoopta/video";
import { FileCommands } from "@yoopta/file";

import { CHAT_PLUGINS, CHAT_INPUT_PLUGINS } from "./plugins";
import { CHAT_MARKS } from "./marks";
import { applyTheme } from "@yoopta/themes-shadcn";
import { ChatInputEditor } from "./editor";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, Video as VideoIcon, MoreVertical, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ChatMessage,
  ChatUser,
  INITIAL_CONVERSATIONS,
  EMPTY_EDITOR_VALUE,
  CURRENT_USER,
} from "./initialValue";

function MessageStatus({ status }: { status: "sent" | "delivered" | "read" }) {
  if (status === "sent") return <Check className="w-3 h-3 text-neutral-400" />;
  if (status === "delivered") return <CheckCheck className="w-3 h-3 text-neutral-400" />;
  return <CheckCheck className="w-3 h-3 text-blue-500" />;
}

function MessageBubble({
  message,
  isOwn,
  sender,
  showAvatar,
}: {
  message: ChatMessage;
  isOwn: boolean;
  sender: ChatUser;
  showAvatar: boolean;
}) {
  const previewEditor = useMemo(() => {
    return createYooptaEditor({
      plugins: applyTheme(CHAT_PLUGINS) as unknown as YooptaPlugin<
        Record<string, SlateElement>,
        unknown
      >[],
      marks: CHAT_MARKS,
      readOnly: true,
      value: message.content,
    });
  }, [message.content]);

  return (
    <div
      className={cn(
        "flex gap-2 max-w-[80%] group",
        isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {!isOwn && (
        <div
          className={cn(
            "shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white",
            showAvatar ? "visible" : "invisible",
            sender.status === "online"
              ? "bg-gradient-to-br from-violet-500 to-purple-600"
              : "bg-gradient-to-br from-neutral-400 to-neutral-500"
          )}
        >
          {sender.avatar}
        </div>
      )}

      <div className={cn("flex flex-col gap-1", isOwn ? "items-end" : "items-start")}>
        <div
          className={cn(
            "relative px-4 py-2.5 rounded-2xl",
            isOwn
              ? "bg-blue-500 rounded-br-md"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-md"
          )}
        >
          <div className={cn("text-sm", isOwn && "[&_code]:bg-blue-400/30")}>
            <YooptaEditor editor={previewEditor} style={{ width: "100%" }} />
          </div>
          {message.reactions && message.reactions.length > 0 && (
            <div
              className={cn(
                "absolute -bottom-3 flex gap-0.5",
                isOwn ? "right-2" : "left-2"
              )}
            >
              {message.reactions.map((reaction, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 text-xs bg-white dark:bg-neutral-900 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700"
                >
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 px-1">
          {isOwn && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  );
}

const INPUT_BAR_HEIGHT = 140;

export function SocialMediaChatEditor() {
  const [messages, setMessages] = useState<ChatMessage[]>(
    INITIAL_CONVERSATIONS[0]?.messages || []
  );
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const otherUser = INITIAL_CONVERSATIONS[0]?.participants.find((p) => p.id !== "me");

  const editor = useMemo(() => {
    return createYooptaEditor({
      plugins: applyTheme(CHAT_INPUT_PLUGINS) as unknown as YooptaPlugin<
        Record<string, SlateElement>,
        unknown
      >[],
      marks: CHAT_MARKS,
      value: EMPTY_EDITOR_VALUE,
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(() => {
    const content = editor.getEditorValue();
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: "me",
      content,
      timestamp: new Date(),
      status: "sent",
    };
    setMessages((prev) => [...prev, newMessage]);
    editor.setEditorValue(null);
  }, [editor]);

  const uploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const imageUrl = URL.createObjectURL(file);
      ImageCommands.insertImage(editor, {
        props: {
          id: file.name,
          src: imageUrl,
          alt: file.name,
          fit: "contain",
          bgColor: "transparent",
          sizes: { width: 400, height: 300 },
        },
        focus: true,
      });
      if (imageInputRef.current) imageInputRef.current.value = "";
      setAttachmentOpen(false);
    },
    [editor]
  );

  const uploadVideo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const videoUrl = URL.createObjectURL(file);
      VideoCommands.insertVideo(editor, {
        props: {
          src: videoUrl,
          fit: "contain",
          sizes: { width: 400, height: 300 },
        },
        focus: true,
      });
      if (videoInputRef.current) videoInputRef.current.value = "";
      setAttachmentOpen(false);
    },
    [editor]
  );

  const uploadFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const fileUrl = URL.createObjectURL(file);
      FileCommands.insertFile(editor, {
        props: {
          src: fileUrl,
          name: file.name,
          size: file.size,
          format: file.name.split(".").pop() || "",
        },
        focus: true,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      setAttachmentOpen(false);
    },
    [editor]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const activeElement = document.activeElement;
        const isInEditor = inputRef.current?.contains(activeElement);
        if (isInEditor) {
          e.preventDefault();
          sendMessage();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sendMessage]);

  const toggleBold = () => Marks.toggle(editor, { type: "bold" });
  const toggleItalic = () => Marks.toggle(editor, { type: "italic" });
  const toggleCode = () => Marks.toggle(editor, { type: "code" });
  const insertBlock = (type: string) => Blocks.insertBlock(editor, type, { focus: true });

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-neutral-950 max-w-2xl mx-auto w-full">
      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={uploadImage}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={uploadVideo}
      />
      <input ref={fileInputRef} type="file" className="hidden" onChange={uploadFile} />

      {/* Header */}
      <header className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-semibold text-white">
            {otherUser?.avatar}
          </div>
          {otherUser?.status === "online" && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-neutral-950" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-neutral-900 dark:text-white text-sm truncate">
            {otherUser?.name}
          </h2>
          <p className="text-xs text-green-500">online</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <VideoIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Messages - scrollable */}
      <div className="flex-1 min-h-0 flex flex-col">
        <ScrollArea className="flex-1">
          <div
            className="p-4 space-y-4"
            style={{ paddingBottom: INPUT_BAR_HEIGHT }}
          >
            {messages.map((message, idx) => {
              const sender =
                INITIAL_CONVERSATIONS[0]?.participants.find(
                  (p) => p.id === message.senderId
                ) || CURRENT_USER;
              const isOwn = message.senderId === "me";
              const prevMessage = messages[idx - 1];
              const showAvatar =
                !prevMessage || prevMessage.senderId !== message.senderId;
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  sender={sender}
                  showAvatar={showAvatar}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Chat input - fixed at bottom */}
      <div
        className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-3"
        style={{ minHeight: INPUT_BAR_HEIGHT }}
      >
        <ChatInputEditor
          editor={editor}
          inputRef={inputRef}
          placeholder="Type a message..."
          attachmentOpen={attachmentOpen}
          onAttachmentOpenChange={setAttachmentOpen}
          onImageClick={() => imageInputRef.current?.click()}
          onVideoClick={() => videoInputRef.current?.click()}
          onFileClick={() => fileInputRef.current?.click()}
          onBold={toggleBold}
          onItalic={toggleItalic}
          onCode={toggleCode}
          onInsertBlock={insertBlock}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
}
