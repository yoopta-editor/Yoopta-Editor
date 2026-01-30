"use client";

import { useCallback, useRef, useState } from "react";
import {
  BaseYooEditor,
  Blocks,
  Elements,
  Marks,
  Selection,
  useYooptaEditor,
  YooEditor,
} from "@yoopta/editor";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Minus,
  Table,
  Image,
  Video,
  FileIcon,
  Link,
  ChevronDown,
  Plus,
  Copy,
  Trash2,
  MoveUp,
  MoveDown,
  Indent,
  Outdent,
  Type,
  Palette,
  Download,
  FileText,
  FileCode,
  Mail,
  Printer,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ToolbarButton = ({
  onClick,
  active,
  disabled,
  title,
  children,
  className,
}: ToolbarButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "h-8 w-8 p-0",
      active && "bg-neutral-200 dark:bg-neutral-700",
      className
    )}
  >
    {children}
  </Button>
);

const ToolbarSeparator = () => (
  <Separator orientation="vertical" className="h-6 mx-1" />
);

const HIGHLIGHT_COLORS = [
  "#FFFF00",
  "#00FF00",
  "#00FFFF",
  "#FF00FF",
  "#FF0000",
  "#0000FF",
  "#FFE4B5",
  "#E6E6FA",
  "#FFFFFF",
];

const TEXT_COLORS = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
  "#808080",
];

interface WordToolbarProps {
  onExport: (format: "html" | "markdown" | "text" | "json") => void;
  onPrint: () => void;
  editor: BaseYooEditor;
}

export const WordToolbar = ({ editor, onExport, onPrint }: WordToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);

  // Get current block for alignment
  const getCurrentBlock = useCallback(() => {
    return Blocks.getBlock(editor, { at: editor.path.current });
  }, [editor]);

  // Mark operations
  const toggleBold = () => Marks.toggle(editor, { type: "bold" });
  const toggleItalic = () => Marks.toggle(editor, { type: "italic" });
  const toggleUnderline = () => Marks.toggle(editor, { type: "underline" });
  const toggleStrike = () => Marks.toggle(editor, { type: "strike" });
  const toggleCode = () => Marks.toggle(editor, { type: "code" });

  const setHighlight = (color: string) => {
    Marks.add(editor, {
      type: "highlight",
      value: { backgroundColor: color },
    });
  };

  const setTextColor = (color: string) => {
    Marks.add(editor, {
      type: "highlight",
      value: { color },
    });
  };

  const clearFormatting = () => {
    Marks.clear(editor, {});
  };

  // History operations
  const handleUndo = () => editor.undo();
  const handleRedo = () => editor.redo();

  // Block type operations
  const insertParagraph = () => {
    Blocks.insertBlock(editor, "Paragraph", { focus: true });
  };

  const toggleHeading = (level: 1 | 2 | 3) => {
    const types = {
      1: "HeadingOne",
      2: "HeadingTwo",
      3: "HeadingThree",
    };
    Blocks.toggleBlock(editor, types[level], { focus: true });
  };

  const toggleBulletedList = () => {
    Blocks.toggleBlock(editor, "BulletedList", { focus: true });
  };

  const toggleNumberedList = () => {
    Blocks.toggleBlock(editor, "NumberedList", { focus: true });
  };

  const toggleTodoList = () => {
    Blocks.toggleBlock(editor, "TodoList", { focus: true });
  };

  const toggleBlockquote = () => {
    Blocks.toggleBlock(editor, "Blockquote", { focus: true });
  };

  const insertDivider = () => {
    Blocks.insertBlock(editor, "Divider", { focus: true });
  };

  const insertTable = () => {
    Blocks.insertBlock(editor, "Table", { focus: true });
  };

  const insertCallout = () => {
    Blocks.insertBlock(editor, "Callout", { focus: true });
  };

  const insertCode = () => {
    Blocks.insertBlock(editor, "Code", { focus: true });
  };

  const insertAccordion = () => {
    Blocks.insertBlock(editor, "Accordion", { focus: true });
  };

  // Alignment operations
  const setAlignment = (align: "left" | "center" | "right") => {
    const block = getCurrentBlock();
    if (block) {
      editor.updateBlock(block.id, {
        meta: { ...block.meta, align },
      });
    }
  };

  // Block manipulation
  const duplicateCurrentBlock = () => {
    Blocks.duplicateBlock(editor, { focus: true });
  };

  const deleteCurrentBlock = () => {
    Blocks.deleteBlock(editor, { focusTarget: "previous" });
  };

  const moveBlockUp = () => {
    const block = getCurrentBlock();
    if (block && block.meta.order > 0) {
      Blocks.moveBlock(editor, block.id, block.meta.order - 1);
    }
  };

  const moveBlockDown = () => {
    const block = getCurrentBlock();
    if (block) {
      const blockCount = Object.keys(editor.getEditorValue()).length;
      if (block.meta.order < blockCount - 1) {
        Blocks.moveBlock(editor, block.id, block.meta.order + 2);
      }
    }
  };

  const increaseIndent = () => {
    Blocks.increaseBlockDepth(editor, {});
  };

  const decreaseIndent = () => {
    Blocks.decreaseBlockDepth(editor, {});
  };

  // Media insertion
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const src = URL.createObjectURL(file);

      Blocks.insertBlock(editor, "Image", {
        focus: true,
        elements: editor.y("image", {
          props: {
            src,
            alt: file.name,
            nodeType: "void",
          },
        }),
      });
    }
    e.target.value = "";
  };

  const insertVideo = () => {
    Blocks.insertBlock(editor, "Video", { focus: true });
  };

  const insertFile = () => {
    Blocks.insertBlock(editor, "File", { focus: true });
  };

  const insertEmbed = () => {
    Blocks.insertBlock(editor, "Embed", { focus: true });
  };

  // Link insertion
  const insertLink = () => {
    if (!linkUrl) return;

    const block = getCurrentBlock();
    if (block) {
      Elements.insertElement(editor, {
        blockId: block.id,
        type: "link",
        props: {
          url: linkUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          nodeType: "inline",
        },
      });
    }
    setLinkUrl("");
    setLinkOpen(false);
  };

  // Check mark states
  const isBoldActive = Marks.isActive(editor, { type: "bold" });
  const isItalicActive = Marks.isActive(editor, { type: "italic" });
  const isUnderlineActive = Marks.isActive(editor, { type: "underline" });
  const isStrikeActive = Marks.isActive(editor, { type: "strike" });
  const isCodeActive = Marks.isActive(editor, { type: "code" });

  // Get current alignment
  const currentBlock = getCurrentBlock();
  const currentAlign = currentBlock?.meta?.align || "left";

  return (
    <div className="sticky top-16 z-40 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
      {/* File Menu Bar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-neutral-200 dark:border-neutral-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-sm">
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Download className="w-4 h-4 mr-2" />
                Export as
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => onExport("html")}>
                  <FileCode className="w-4 h-4 mr-2" />
                  HTML
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport("markdown")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Markdown
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport("text")}>
                  <Type className="w-4 h-4 mr-2" />
                  Plain Text
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport("json")}>
                  <FileCode className="w-4 h-4 mr-2" />
                  JSON
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onPrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-sm">
              Edit
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={handleUndo}>
              <Undo2 className="w-4 h-4 mr-2" />
              Undo
              <span className="ml-auto text-xs text-neutral-500">Ctrl+Z</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRedo}>
              <Redo2 className="w-4 h-4 mr-2" />
              Redo
              <span className="ml-auto text-xs text-neutral-500">Ctrl+Y</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={duplicateCurrentBlock}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate Block
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={deleteCurrentBlock}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Block
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-sm">
              Insert
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={insertTable}>
              <Table className="w-4 h-4 mr-2" />
              Table
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImageUpload}>
              <Image className="w-4 h-4 mr-2" />
              Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertVideo}>
              <Video className="w-4 h-4 mr-2" />
              Video
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertFile}>
              <FileIcon className="w-4 h-4 mr-2" />
              File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertEmbed}>
              <Sparkles className="w-4 h-4 mr-2" />
              Embed
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={insertDivider}>
              <Minus className="w-4 h-4 mr-2" />
              Divider
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertCode}>
              <Code className="w-4 h-4 mr-2" />
              Code Block
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertCallout}>
              <Quote className="w-4 h-4 mr-2" />
              Callout
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertAccordion}>
              <ChevronDown className="w-4 h-4 mr-2" />
              Accordion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-sm">
              Format
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={toggleBold}>
              <Bold className="w-4 h-4 mr-2" />
              Bold
              <span className="ml-auto text-xs text-neutral-500">Ctrl+B</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleItalic}>
              <Italic className="w-4 h-4 mr-2" />
              Italic
              <span className="ml-auto text-xs text-neutral-500">Ctrl+I</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleUnderline}>
              <Underline className="w-4 h-4 mr-2" />
              Underline
              <span className="ml-auto text-xs text-neutral-500">Ctrl+U</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleStrike}>
              <Strikethrough className="w-4 h-4 mr-2" />
              Strikethrough
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearFormatting}>
              <Type className="w-4 h-4 mr-2" />
              Clear Formatting
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        {/* Undo/Redo */}
        <ToolbarButton onClick={handleUndo} title="Undo (Ctrl+Z)">
          <Undo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={handleRedo} title="Redo (Ctrl+Y)">
          <Redo2 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Block Type Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 gap-1 min-w-[100px] justify-between"
            >
              <span className="text-xs truncate">
                {currentBlock?.type || "Paragraph"}
              </span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={insertParagraph}>
              <Pilcrow className="w-4 h-4 mr-2" />
              Paragraph
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleHeading(1)}>
              <Heading1 className="w-4 h-4 mr-2" />
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleHeading(2)}>
              <Heading2 className="w-4 h-4 mr-2" />
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleHeading(3)}>
              <Heading3 className="w-4 h-4 mr-2" />
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleBulletedList}>
              <List className="w-4 h-4 mr-2" />
              Bulleted List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleNumberedList}>
              <ListOrdered className="w-4 h-4 mr-2" />
              Numbered List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTodoList}>
              <CheckSquare className="w-4 h-4 mr-2" />
              Todo List
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleBlockquote}>
              <Quote className="w-4 h-4 mr-2" />
              Quote
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ToolbarSeparator />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={toggleBold}
          active={isBoldActive}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleItalic}
          active={isItalicActive}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleUnderline}
          active={isUnderlineActive}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleStrike}
          active={isStrikeActive}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleCode}
          active={isCodeActive}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Text Color"
            >
              <div className="flex flex-col items-center">
                <Type className="w-4 h-4" />
                <div className="w-4 h-1 bg-red-500 -mt-0.5" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-5 gap-1">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setTextColor(color)}
                  className="w-6 h-6 rounded border border-neutral-200 dark:border-neutral-700 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Highlight Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Highlight Color"
            >
              <Highlighter className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-5 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setHighlight(color)}
                  className="w-6 h-6 rounded border border-neutral-200 dark:border-neutral-700 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => Marks.remove(editor, { type: "highlight" })}
              className="w-full mt-2 h-7 text-xs"
            >
              Remove Highlight
            </Button>
          </PopoverContent>
        </Popover>

        <ToolbarSeparator />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => setAlignment("left")}
          active={currentAlign === "left"}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setAlignment("center")}
          active={currentAlign === "center"}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setAlignment("right")}
          active={currentAlign === "right"}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Indentation */}
        <ToolbarButton onClick={decreaseIndent} title="Decrease Indent">
          <Outdent className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={increaseIndent} title="Increase Indent">
          <Indent className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Lists */}
        <ToolbarButton
          onClick={toggleBulletedList}
          active={currentBlock?.type === "BulletedList"}
          title="Bulleted List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleNumberedList}
          active={currentBlock?.type === "NumberedList"}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleTodoList}
          active={currentBlock?.type === "TodoList"}
          title="Todo List"
        >
          <CheckSquare className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Insert Elements */}
        <Popover open={linkOpen} onOpenChange={setLinkOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Insert Link"
            >
              <Link className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <p className="text-sm font-medium">Insert Link</p>
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && insertLink()}
              />
              <Button size="sm" onClick={insertLink} className="w-full">
                Insert
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <ToolbarButton onClick={handleImageUpload} title="Insert Image">
          <Image className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={insertTable} title="Insert Table">
          <Table className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={insertDivider} title="Insert Divider">
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Block Operations */}
        <ToolbarButton onClick={moveBlockUp} title="Move Block Up">
          <MoveUp className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={moveBlockDown} title="Move Block Down">
          <MoveDown className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={duplicateCurrentBlock} title="Duplicate Block">
          <Copy className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={deleteCurrentBlock}
          title="Delete Block"
          className="hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <Trash2 className="w-4 h-4" />
        </ToolbarButton>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
