"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Send,
  Paperclip,
  Phone,
  Video as VideoIcon,
  MoreVertical,
  Check,
  CheckCheck,
  Bold,
  Italic,
  Code,
  Image as ImageIcon,
  FileText,
  Film,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Code2,
} from "lucide-react";
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
    });
  }, []);

  useEffect(() => {
    previewEditor.setEditorValue(message.content);
  }, [previewEditor, message.content]);

  return (
    <div
      className={cn(
        "flex gap-2 max-w-[80%] group",
        isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar */}
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
        {/* Message bubble */}
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

          {/* Reactions */}
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

        {/* Time and status */}
        <div className="flex items-center gap-1 px-1">
          {/* <span className="text-[10px] text-neutral-400">{formatTime(message.timestamp)}</span> */}
          {isOwn && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  );
}

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

  const sendMessage = () => {
    const content = editor.getEditorValue();

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: "me",
      content,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    // setMessages((prev) =>
    //   prev.map((msg) =>
    //     msg.id === newMessage.id ? { ...msg, status: "read" } : msg
    //   )
    // );

    editor.setEditorValue(null);

  };

  const uploadImage =
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Create a local URL for the image (in real app, upload to server)
      const imageUrl = URL.createObjectURL(file);

      ImageCommands.insertImage(editor, {
        props: {
          id: file.name,
          src: imageUrl,
          alt: file.name,
          fit: "contain",
          bgColor: "transparent",
          sizes: {
            width: 400,
            height: 300,
          },
        },
        focus: true,
      });

      // Reset input
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      setAttachmentOpen(false);
    };

  const uploadVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local URL for the video (in real app, upload to server)
    const videoUrl = URL.createObjectURL(file);

    VideoCommands.insertVideo(editor, {
      props: {
        src: videoUrl,
        fit: "contain",
        sizes: {
          width: 400,
          height: 300,
        },
      },
      focus: true,
    });

    // Reset input
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
    setAttachmentOpen(false);
  };

  const uploadFile =
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Create a local URL for the file (in real app, upload to server)
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

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setAttachmentOpen(false);
    };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();

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

  const insertBlock = (type: string) => {
    Blocks.insertBlock(editor, type, { focus: true });
  };

  return (
    <div className="relative flex flex-col h-full bg-white dark:bg-neutral-950 max-w-2xl mx-auto w-full">
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
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={uploadFile}
      />

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-semibold">
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

        <div className="flex items-center gap-1">
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
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 pb-[140px]">
        <div className="p-4 space-y-4 pt-16">
          {messages.map((message, idx) => {
            const sender =
              INITIAL_CONVERSATIONS[0]?.participants.find(
                (p) => p.id === message.senderId
              ) || CURRENT_USER;
            const isOwn = message.senderId === "me";
            const prevMessage = messages[idx - 1];
            const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

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

      {/* Message composer - Fixed to bottom */}
      <div className="fixed max-w-2xl mx-auto bottom-0 left-0 right-0 p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="flex items-end gap-2">
          {/* Input area */}
          <div
            ref={inputRef}
            className="flex-1 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 overflow-hidden"
          >
            {/* Toolbar: attachments + marks + blocks */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-neutral-200 dark:border-neutral-800">
              {/* Attachments */}
              <DropdownMenu open={attachmentOpen} onOpenChange={setAttachmentOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-500" title="Attach">
                    <Paperclip className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top" className="w-48">
                  <DropdownMenuItem
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Image</p>
                      <p className="text-xs text-neutral-500">Share photos</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => videoInputRef.current?.click()}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Film className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Video</p>
                      <p className="text-xs text-neutral-500">Share videos</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">File</p>
                      <p className="text-xs text-neutral-500">Share documents</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <span className="w-px h-4 mx-0.5 bg-neutral-200 dark:bg-neutral-700" aria-hidden />

              {/* Marks */}
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleBold} title="Bold">
                <Bold className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleItalic} title="Italic">
                <Italic className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleCode} title="Inline code">
                <Code className="w-3.5 h-3.5" />
              </Button>

              <span className="w-px h-4 mx-0.5 bg-neutral-200 dark:bg-neutral-700" aria-hidden />

              {/* Text */}
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertBlock("Paragraph")} title="Paragraph">
                <Type className="w-3.5 h-3.5" />
              </Button>

              <span className="w-px h-4 mx-0.5 bg-neutral-200 dark:bg-neutral-700" aria-hidden />

              {/* Headings */}
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertBlock("HeadingOne")} title="Heading 1">
                <Heading1 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertBlock("HeadingTwo")} title="Heading 2">
                <Heading2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertBlock("HeadingThree")} title="Heading 3">
                <Heading3 className="w-3.5 h-3.5" />
              </Button>

              <span className="w-px h-4 mx-0.5 bg-neutral-200 dark:bg-neutral-700" aria-hidden />

              {/* Lists */}
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertBlock("BulletedList")} title="Bulleted list">
                <List className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertBlock("NumberedList")} title="Numbered list">
                <ListOrdered className="w-3.5 h-3.5" />
              </Button>

              <span className="w-px h-4 mx-0.5 bg-neutral-200 dark:bg-neutral-700" aria-hidden />

              {/* Code block, Blockquote, Divider */}
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertBlock("Code")} title="Code block">
                <Code2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertBlock("Blockquote")} title="Blockquote">
                <Quote className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertBlock("Divider")} title="Divider">
                <Minus className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="min-h-[80px] max-h-[420px] overflow-auto px-4 py-2">
              <YooptaEditor
                editor={editor}
                style={{ width: "100%" }}
                placeholder="Type a message..."
              />
            </div>
          </div>

          <Button
            size="icon"
            className="h-9 w-9 mb-0.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            onClick={sendMessage}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
