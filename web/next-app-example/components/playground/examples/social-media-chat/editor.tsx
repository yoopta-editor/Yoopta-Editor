"use client";

import YooptaEditor from "@yoopta/editor";
import type { YooEditor } from "@yoopta/editor";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  Code,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Code2,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Film,
  Send,
} from "lucide-react";

export type ChatInputEditorProps = {
  editor: YooEditor;
  inputRef: React.RefObject<HTMLDivElement | null>;
  placeholder?: string;
  attachmentOpen: boolean;
  onAttachmentOpenChange: (open: boolean) => void;
  onImageClick: () => void;
  onVideoClick: () => void;
  onFileClick: () => void;
  onBold: () => void;
  onItalic: () => void;
  onCode: () => void;
  onInsertBlock: (type: string) => void;
  onSend: () => void;
};

export function ChatInputEditor({
  editor,
  inputRef,
  placeholder = "Type a message...",
  attachmentOpen,
  onAttachmentOpenChange,
  onImageClick,
  onVideoClick,
  onFileClick,
  onBold,
  onItalic,
  onCode,
  onInsertBlock,
  onSend,
}: ChatInputEditorProps) {
  return (
    <div
      ref={inputRef}
      className="relative flex-1 min-w-0 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 overflow-hidden"
    >
      {/* Toolbar: attachments + marks + blocks */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-neutral-200 dark:border-neutral-800">
        <DropdownMenu open={attachmentOpen} onOpenChange={onAttachmentOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-500" title="Attach">
              <Paperclip className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-48">
            <DropdownMenuItem onClick={onImageClick} className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Image</p>
                <p className="text-xs text-neutral-500">Share photos</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onVideoClick} className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Film className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Video</p>
                <p className="text-xs text-neutral-500">Share videos</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onFileClick} className="flex items-center gap-3 cursor-pointer">
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

        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onBold} title="Bold">
          <Bold className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onItalic} title="Italic">
          <Italic className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCode} title="Inline code">
          <Code className="w-3.5 h-3.5" />
        </Button>

        <span className="w-px h-4 mx-0.5 bg-neutral-200 dark:bg-neutral-700" aria-hidden />

        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onInsertBlock("Paragraph")} title="Paragraph">
          <Type className="w-3.5 h-3.5" />
        </Button>

        <span className="w-px h-4 mx-0.5 bg-neutral-200 dark:bg-neutral-700" aria-hidden />

        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onInsertBlock("HeadingOne")} title="Heading 1">
          <Heading1 className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onInsertBlock("HeadingTwo")} title="Heading 2">
          <Heading2 className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onInsertBlock("HeadingThree")} title="Heading 3">
          <Heading3 className="w-3.5 h-3.5" />
        </Button>

        <span className="w-px h-4 mx-0.5 bg-neutral-200 dark:bg-neutral-700" aria-hidden />

        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onInsertBlock("BulletedList")} title="Bulleted list">
          <List className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onInsertBlock("NumberedList")} title="Numbered list">
          <ListOrdered className="w-3.5 h-3.5" />
        </Button>

        <span className="w-px h-4 mx-0.5 bg-neutral-200 dark:bg-neutral-700" aria-hidden />

        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onInsertBlock("Code")} title="Code block">
          <Code2 className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onInsertBlock("Blockquote")} title="Blockquote">
          <Quote className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onInsertBlock("Divider")} title="Divider">
          <Minus className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="relative min-h-[80px] max-h-[280px] overflow-auto pl-4 pr-12 py-2">
        <YooptaEditor editor={editor} style={{ width: "100%" }} placeholder={placeholder} />
        <Button
          size="icon"
          className="absolute right-2 bottom-2 h-9 w-9 shrink-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          onClick={onSend}
          title="Send"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
