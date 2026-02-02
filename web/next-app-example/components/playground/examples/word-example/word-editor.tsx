"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import YooptaEditor, {
  createYooptaEditor,
  RenderBlockProps,
  SlateElement,
  YooptaContentValue,
  YooptaPlugin,
} from "@yoopta/editor";

import { WORD_PLUGINS } from "./plugins";
import { WORD_MARKS } from "./marks";
import { WordToolbar } from "./word-toolbar";
import { SelectionBox } from "@yoopta/ui/selection-box";
import { BlockDndContext, SortableBlock } from "@yoopta/ui/block-dnd";
import { withMentions } from "@yoopta/mention";
import { applyTheme } from "@yoopta/themes-shadcn";
// @ts-expect-error - MentionDropdown types not properly exported
import { MentionDropdown } from "@yoopta/themes-shadcn/mention";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, FileText, Zap, Keyboard, MousePointerClick, Code2 } from "lucide-react";
import { YooptaSlashCommandMenu } from "../full-setup/new-yoo-components/yoopta-slash-command-menu";

const EDITOR_STYLES = {
  width: "100%",
  paddingBottom: 100,
};

// Using type assertion as the content value includes text marks (bold, italic, etc.)
// which are added by plugins and not in the base type definition
const INITIAL_VALUE = {
  "block-1": {
    id: "block-1",
    type: "HeadingOne",
    value: [
      {
        id: "element-1",
        type: "heading-one",
        children: [{ text: "Welcome to Yoopta Word Example" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 0, depth: 0 },
  },
  "block-2": {
    id: "block-2",
    type: "Paragraph",
    value: [
      {
        id: "element-2",
        type: "paragraph",
        children: [
          { text: "This example showcases a " },
          { text: "Microsoft Word-like", bold: true },
          { text: " interface with a " },
          { text: "fixed toolbar", italic: true },
          { text: " at the top. Every button in the toolbar uses the " },
          { text: "Yoopta Editor API", code: true },
          { text: " methods directly." },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 1, depth: 0 },
  },
  "block-3": {
    id: "block-3",
    type: "HeadingTwo",
    value: [
      {
        id: "element-3",
        type: "heading-two",
        children: [{ text: "Features Demonstrated" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 2, depth: 0 },
  },
  "block-4": {
    id: "block-4",
    type: "BulletedList",
    value: [
      {
        id: "element-4",
        type: "bulleted-list",
        children: [
          {
            id: "li-1",
            type: "list-item",
            children: [
              { text: "Text Formatting: ", bold: true },
              { text: "Bold, Italic, Underline, Strikethrough, Code" },
            ],
            props: { nodeType: "block" },
          },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 3, depth: 0 },
  },
  "block-5": {
    id: "block-5",
    type: "BulletedList",
    value: [
      {
        id: "element-5",
        type: "bulleted-list",
        children: [
          {
            id: "li-2",
            type: "list-item",
            children: [
              { text: "Block Operations: ", bold: true },
              { text: "Insert, Delete, Duplicate, Move Up/Down" },
            ],
            props: { nodeType: "block" },
          },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 4, depth: 0 },
  },
  "block-6": {
    id: "block-6",
    type: "BulletedList",
    value: [
      {
        id: "element-6",
        type: "bulleted-list",
        children: [
          {
            id: "li-3",
            type: "list-item",
            children: [
              { text: "Block Types: ", bold: true },
              { text: "Headings, Lists, Quotes, Tables, Code, etc." },
            ],
            props: { nodeType: "block" },
          },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 5, depth: 0 },
  },
  "block-7": {
    id: "block-7",
    type: "BulletedList",
    value: [
      {
        id: "element-7",
        type: "bulleted-list",
        children: [
          {
            id: "li-4",
            type: "list-item",
            children: [
              { text: "Export Options: ", bold: true },
              { text: "HTML, Markdown, Plain Text, JSON" },
            ],
            props: { nodeType: "block" },
          },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 6, depth: 0 },
  },
  "block-8": {
    id: "block-8",
    type: "Callout",
    value: [
      {
        id: "element-8",
        type: "callout",
        children: [
          {
            text: "Try selecting some text and using the toolbar buttons, or use the File menu to export your content!",
          },
        ],
        props: { nodeType: "block", theme: "info" },
      },
    ],
    meta: { order: 7, depth: 0 },
  },
  "block-9": {
    id: "block-9",
    type: "HeadingTwo",
    value: [
      {
        id: "element-9",
        type: "heading-two",
        children: [{ text: "API Methods Used" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 8, depth: 0 },
  },
  "block-10": {
    id: "block-10",
    type: "Paragraph",
    value: [
      {
        id: "element-10",
        type: "paragraph",
        children: [
          { text: "This example demonstrates the following API namespaces:" },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 9, depth: 0 },
  },
  "block-11": {
    id: "block-11",
    type: "Code",
    value: [
      {
        id: "element-11",
        type: "code",
        children: [
          {
            text: `// Marks API - Text Formatting
Marks.toggle(editor, { type: 'bold' })
Marks.isActive(editor, { type: 'italic' })
Marks.add(editor, { type: 'highlight', value: { backgroundColor: '#FFFF00' } })
Marks.remove(editor, { type: 'highlight' })
Marks.clear(editor, {})

// Blocks API - Block Operations
editor.insertBlock('Paragraph', { focus: true })
editor.deleteBlock({ focusTarget: 'previous' })
editor.duplicateBlock({ focus: true })
editor.toggleBlock('HeadingOne', { focus: true })
editor.moveBlock(blockId, newOrder)
editor.updateBlock(blockId, { meta: { align: 'center' } })
editor.increaseBlockDepth({})
editor.decreaseBlockDepth({})

// Selection API
Selection.getCurrent(editor, {})
Blocks.getBlock(editor, { at: current })

// History API
editor.undo()
editor.redo()

// Export API
editor.getHTML(editor.getEditorValue())
editor.getMarkdown(editor.getEditorValue())
editor.getPlainText(editor.getEditorValue())`,
          },
        ],
        props: { nodeType: "void", language: "typescript" },
      },
    ],
    meta: { order: 10, depth: 0 },
  },
  "block-12": {
    id: "block-12",
    type: "Divider",
    value: [
      {
        id: "element-12",
        type: "divider",
        children: [{ text: "" }],
        props: { nodeType: "void" },
      },
    ],
    meta: { order: 11, depth: 0 },
  },
  "block-13": {
    id: "block-13",
    type: "Paragraph",
    value: [
      {
        id: "element-13",
        type: "paragraph",
        children: [
          { text: "Start editing below to try out all the features! Use " },
          { text: "/", code: true },
          { text: " to open the slash command menu." },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 12, depth: 0 },
  },
};

export const WordEditor = () => {
  const containerBoxRef = useRef<HTMLDivElement>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportContent, setExportContent] = useState("");
  const [exportFormat, setExportFormat] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const editor = useMemo(() => {
    return withMentions(
      createYooptaEditor({
        plugins: applyTheme(WORD_PLUGINS) as unknown as YooptaPlugin<
          Record<string, SlateElement>,
          unknown
        >[],
        marks: WORD_MARKS,
      })
    );
  }, []);

  const onChange = (value: YooptaContentValue) => {
    localStorage.setItem("yoopta-word-example", JSON.stringify(value));
  };

  useEffect(() => {
    const localStorageValue = localStorage.getItem("yoopta-word-example");
    const data = localStorageValue ? JSON.parse(localStorageValue) : INITIAL_VALUE;
    editor.setEditorValue(data);
  }, [editor]);

  const renderBlock = useCallback(({ children, blockId }: RenderBlockProps) => {
    return (
      <SortableBlock id={blockId} useDragHandle>
        {children}
      </SortableBlock>
    );
  }, []);

  const handleExport = useCallback(
    (format: "html" | "markdown" | "text" | "json") => {
      const value = editor.getEditorValue();
      let content = "";

      switch (format) {
        case "html":
          content = editor.getHTML(value);
          break;
        case "markdown":
          content = editor.getMarkdown(value);
          break;
        case "text":
          content = editor.getPlainText(value);
          break;
        case "json":
          content = JSON.stringify(value, null, 2);
          break;
      }

      setExportContent(content);
      setExportFormat(format.toUpperCase());
      setExportDialogOpen(true);
    },
    [editor]
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(exportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [exportContent]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Toolbar */}
      <WordToolbar editor={editor} onExport={handleExport} onPrint={handlePrint} />

      {/* Editor Area */}
      <div className="flex-1 bg-neutral-100 dark:bg-neutral-900 overflow-auto">
        <div className="max-w-5xl mx-auto py-8 px-4">
          {/* Paper-like container */}
          <div
            ref={containerBoxRef}
            className="bg-white dark:bg-neutral-950 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 min-h-[800px]"
          >
            <div className="p-8 md:p-12 lg:p-16">
              <BlockDndContext editor={editor}>
                <YooptaEditor
                  editor={editor}
                  style={EDITOR_STYLES}
                  onChange={onChange}
                  renderBlock={renderBlock}
                  placeholder="Type / to open menu, or start typing..."
                >
                  <SelectionBox selectionBoxElement={containerBoxRef} />
                  <YooptaSlashCommandMenu />
                  <MentionDropdown />
                </YooptaEditor>
              </BlockDndContext>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
              Built with Yoopta Editor - A powerful rich-text editor
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://docs.yoopta.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  Documentation
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/Darginec05/Yoopta-Editor"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Source
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog modal open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Export as {exportFormat}
              <Badge variant="secondary">{exportFormat}</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="relative">
            <ScrollArea className="h-[400px] rounded-md border">
              <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-all">
                {exportContent}
              </pre>
            </ScrollArea>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-4"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
