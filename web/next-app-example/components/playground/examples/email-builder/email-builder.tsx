"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import YooptaEditor, {
  createYooptaEditor,
  SlateElement,
  YooptaContentValue,
  YooptaPlugin,
  Blocks,
  Marks,
} from "@yoopta/editor";

import { EMAIL_PLUGINS } from "./plugins";
import { EMAIL_MARKS } from "./marks";
import { applyTheme } from "@yoopta/themes-shadcn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Send,
  Paperclip,
  Trash2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link2,
  Image,
  Smile,
  MoreVertical,
  ChevronDown,
  X,
  Copy,
  Check,
  Eye,
  Code,
  Columns,
  FileText,
  PanelLeft,
  Sparkles,
  Clock,
  Star,
  Archive,
  Pen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Email templates
const EMAIL_TEMPLATES = [
  {
    id: "blank",
    name: "Blank Email",
    subject: "",
    content: {
      "block-1": {
        id: "block-1",
        type: "Paragraph",
        value: [
          {
            id: "el-1",
            type: "paragraph",
            children: [{ text: "" }],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 0, depth: 0 },
      },
    },
  },
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to Our Platform!",
    content: {
      "block-1": {
        id: "block-1",
        type: "Paragraph",
        value: [
          {
            id: "el-1",
            type: "paragraph",
            children: [{ text: "Hi there," }],
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
            id: "el-2",
            type: "paragraph",
            children: [
              { text: "Welcome to " },
              { text: "Our Platform", bold: true },
              { text: "! We're excited to have you on board." },
            ],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 1, depth: 0 },
      },
      "block-3": {
        id: "block-3",
        type: "Paragraph",
        value: [
          {
            id: "el-3",
            type: "paragraph",
            children: [{ text: "Here's what you can do to get started:" }],
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
            children: [
              {
                id: "li-1",
                type: "list-item",
                children: [{ text: "Complete your profile" }],
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
        type: "NumberedList",
        value: [
          {
            id: "el-5",
            type: "numbered-list",
            children: [
              {
                id: "li-2",
                type: "list-item",
                children: [{ text: "Explore our features" }],
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
        type: "NumberedList",
        value: [
          {
            id: "el-6",
            type: "numbered-list",
            children: [
              {
                id: "li-3",
                type: "list-item",
                children: [{ text: "Connect with your team" }],
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
        type: "Paragraph",
        value: [
          {
            id: "el-7",
            type: "paragraph",
            children: [
              { text: "If you have any questions, feel free to reach out to our support team." },
            ],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 6, depth: 0 },
      },
      "block-8": {
        id: "block-8",
        type: "Paragraph",
        value: [
          {
            id: "el-8",
            type: "paragraph",
            children: [{ text: "" }],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 7, depth: 0 },
      },
      "block-9": {
        id: "block-9",
        type: "Paragraph",
        value: [
          {
            id: "el-9",
            type: "paragraph",
            children: [{ text: "Best regards," }],
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
            id: "el-10",
            type: "paragraph",
            children: [{ text: "The Team", bold: true }],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 9, depth: 0 },
      },
    },
  },
  {
    id: "meeting",
    name: "Meeting Request",
    subject: "Meeting Request: Project Discussion",
    content: {
      "block-1": {
        id: "block-1",
        type: "Paragraph",
        value: [
          {
            id: "el-1",
            type: "paragraph",
            children: [{ text: "Hi," }],
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
            id: "el-2",
            type: "paragraph",
            children: [
              { text: "I'd like to schedule a meeting to discuss our upcoming project. Would any of the following times work for you?" },
            ],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 1, depth: 0 },
      },
      "block-3": {
        id: "block-3",
        type: "BulletedList",
        value: [
          {
            id: "el-3",
            type: "bulleted-list",
            children: [
              {
                id: "li-1",
                type: "list-item",
                children: [{ text: "Monday, 2:00 PM" }],
                props: { nodeType: "block" },
              },
            ],
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
            id: "el-4",
            type: "bulleted-list",
            children: [
              {
                id: "li-2",
                type: "list-item",
                children: [{ text: "Tuesday, 10:00 AM" }],
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
            id: "el-5",
            type: "bulleted-list",
            children: [
              {
                id: "li-3",
                type: "list-item",
                children: [{ text: "Wednesday, 3:00 PM" }],
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
        type: "Paragraph",
        value: [
          {
            id: "el-6",
            type: "paragraph",
            children: [{ text: "Please let me know what works best for you." }],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 5, depth: 0 },
      },
      "block-7": {
        id: "block-7",
        type: "Paragraph",
        value: [
          {
            id: "el-7",
            type: "paragraph",
            children: [{ text: "" }],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 6, depth: 0 },
      },
      "block-8": {
        id: "block-8",
        type: "Paragraph",
        value: [
          {
            id: "el-8",
            type: "paragraph",
            children: [{ text: "Thanks!" }],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 7, depth: 0 },
      },
    },
  },
  {
    id: "newsletter",
    name: "Newsletter",
    subject: "Monthly Newsletter - What's New",
    content: {
      "block-1": {
        id: "block-1",
        type: "HeadingTwo",
        value: [
          {
            id: "el-1",
            type: "heading-two",
            children: [{ text: "This Month's Highlights" }],
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
            id: "el-2",
            type: "paragraph",
            children: [
              { text: "Hello! Here's what's been happening at " },
              { text: "Our Company", bold: true },
              { text: " this month." },
            ],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 1, depth: 0 },
      },
      "block-3": {
        id: "block-3",
        type: "Divider",
        value: [
          {
            id: "el-3",
            type: "divider",
            children: [{ text: "" }],
            props: { nodeType: "void" },
          },
        ],
        meta: { order: 2, depth: 0 },
      },
      "block-4": {
        id: "block-4",
        type: "HeadingThree",
        value: [
          {
            id: "el-4",
            type: "heading-three",
            children: [{ text: "New Features" }],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 3, depth: 0 },
      },
      "block-5": {
        id: "block-5",
        type: "Paragraph",
        value: [
          {
            id: "el-5",
            type: "paragraph",
            children: [
              { text: "We've added some exciting new features based on your feedback:" },
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
            id: "el-6",
            type: "bulleted-list",
            children: [
              {
                id: "li-1",
                type: "list-item",
                children: [{ text: "Dark mode support" }],
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
            id: "el-7",
            type: "bulleted-list",
            children: [
              {
                id: "li-2",
                type: "list-item",
                children: [{ text: "Improved performance" }],
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
        type: "BulletedList",
        value: [
          {
            id: "el-8",
            type: "bulleted-list",
            children: [
              {
                id: "li-3",
                type: "list-item",
                children: [{ text: "New integrations" }],
                props: { nodeType: "block" },
              },
            ],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 7, depth: 0 },
      },
      "block-9": {
        id: "block-9",
        type: "Callout",
        value: [
          {
            id: "el-9",
            type: "callout",
            children: [{ text: "Pro tip: Try the new keyboard shortcuts to speed up your workflow!" }],
            props: { nodeType: "block", theme: "info" },
          },
        ],
        meta: { order: 8, depth: 0 },
      },
      "block-10": {
        id: "block-10",
        type: "Paragraph",
        value: [
          {
            id: "el-10",
            type: "paragraph",
            children: [{ text: "" }],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 9, depth: 0 },
      },
      "block-11": {
        id: "block-11",
        type: "Paragraph",
        value: [
          {
            id: "el-11",
            type: "paragraph",
            children: [{ text: "Stay tuned for more updates!" }],
            props: { nodeType: "block" },
          },
        ],
        meta: { order: 10, depth: 0 },
      },
    },
  },
];

const SIGNATURES = [
  {
    id: "professional",
    name: "Professional",
    content: `Best regards,

John Doe
Software Engineer
john.doe@company.com
+1 (555) 123-4567`,
  },
  {
    id: "casual",
    name: "Casual",
    content: `Cheers,
John`,
  },
  {
    id: "formal",
    name: "Formal",
    content: `Yours sincerely,

John Doe
Senior Software Engineer | Engineering Department
Company Inc.
123 Business Street, Suite 100
City, State 12345
Phone: +1 (555) 123-4567 | Fax: +1 (555) 123-4568
Email: john.doe@company.com | Web: www.company.com`,
  },
];

export function EmailBuilder() {
  const [to, setTo] = useState("recipient@example.com");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("Welcome to Yoopta Editor!");
  const [showCc, setShowCc] = useState(false);
  const [viewMode, setViewMode] = useState<"editor" | "preview" | "split">("editor");
  const [htmlPreview, setHtmlPreview] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSentDialog, setShowSentDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("welcome");

  const editor = useMemo(() => {
    return createYooptaEditor({
      plugins: applyTheme(EMAIL_PLUGINS) as unknown as YooptaPlugin<
        Record<string, SlateElement>,
        unknown
      >[],
      marks: EMAIL_MARKS,
    });
  }, []);

  // Initialize with welcome template
  useEffect(() => {
    const template = EMAIL_TEMPLATES.find((t) => t.id === "welcome");
    if (template) {
      editor.setEditorValue(template.content as YooptaContentValue);
    }
  }, [editor]);

  // Update HTML preview
  const updatePreview = useCallback(() => {
    const content = editor.getEditorValue();
    const html = editor.getHTML(content);
    setHtmlPreview(html);
  }, [editor]);

  useEffect(() => {
    editor.on("change", updatePreview);
    setTimeout(updatePreview, 100);
    return () => {
      editor.off("change", updatePreview);
    };
  }, [editor, updatePreview]);

  const handleSend = useCallback(() => {
    setShowSentDialog(true);
  }, []);

  const handleCopyHtml = useCallback(async () => {
    const content = editor.getEditorValue();
    const html = editor.getHTML(content);
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [editor]);

  const loadTemplate = useCallback(
    (templateId: string) => {
      const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        setSelectedTemplate(templateId);
        setSubject(template.subject);
        editor.setEditorValue(template.content as YooptaContentValue);
      }
    },
    [editor]
  );

  const insertSignature = useCallback(
    (signatureId: string) => {
      const signature = SIGNATURES.find((s) => s.id === signatureId);
      if (signature) {
        const lines = signature.content.split("\n");
        lines.forEach((line) => {
          Blocks.insertBlock(editor, "Paragraph", {
            focus: false,
            blockData: {
              value: [
                {
                  id: crypto.randomUUID(),
                  type: "paragraph",
                  children: [{ text: line }],
                  props: { nodeType: "block" },
                },
              ],
            },
          });
        });
      }
    },
    [editor]
  );

  const handleDiscard = useCallback(() => {
    setTo("");
    setCc("");
    setSubject("");
    loadTemplate("blank");
  }, [loadTemplate]);

  // Formatting actions
  const toggleBold = () => Marks.toggle(editor, { type: "bold" });
  const toggleItalic = () => Marks.toggle(editor, { type: "italic" });
  const toggleUnderline = () => Marks.toggle(editor, { type: "underline" });
  const toggleStrike = () => Marks.toggle(editor, { type: "strike" });

  const insertList = (type: "bulleted" | "numbered") => {
    Blocks.insertBlock(editor, type === "bulleted" ? "BulletedList" : "NumberedList", { focus: true });
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main Email Compose Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-neutral-950">
        {/* Email Header */}
        <div className="border-b border-neutral-200 dark:border-neutral-800">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100 dark:border-neutral-900">
            <div className="flex items-center gap-2">
              <Button onClick={handleSend} size="sm" className="gap-1">
                <Send className="h-4 w-4" />
                Send
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileText className="h-4 w-4" />
                    Templates
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {EMAIL_TEMPLATES.map((template) => (
                    <DropdownMenuItem
                      key={template.id}
                      onClick={() => loadTemplate(template.id)}
                    >
                      {template.name}
                      {selectedTemplate === template.id && (
                        <Check className="h-4 w-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Pen className="h-4 w-4" />
                    Signature
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {SIGNATURES.map((sig) => (
                    <DropdownMenuItem
                      key={sig.id}
                      onClick={() => insertSignature(sig.id)}
                    >
                      {sig.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 rounded-none text-xs",
                    viewMode === "editor" && "bg-neutral-100 dark:bg-neutral-800"
                  )}
                  onClick={() => setViewMode("editor")}
                >
                  <PanelLeft className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 rounded-none border-x border-neutral-200 dark:border-neutral-800 text-xs",
                    viewMode === "split" && "bg-neutral-100 dark:bg-neutral-800"
                  )}
                  onClick={() => setViewMode("split")}
                >
                  <Columns className="h-3 w-3 mr-1" />
                  Split
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 rounded-none text-xs",
                    viewMode === "preview" && "bg-neutral-100 dark:bg-neutral-800"
                  )}
                  onClick={() => setViewMode("preview")}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyHtml}
                className="gap-1"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Code className="h-3 w-3" />
                    Copy HTML
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={handleDiscard}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Recipients */}
          <div className="px-4 py-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-12">To:</span>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="flex-1 h-8 border-0 shadow-none focus-visible:ring-0 px-0"
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => setShowCc(!showCc)}
              >
                {showCc ? "Hide Cc" : "Cc"}
              </Button>
            </div>

            {showCc && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-12">Cc:</span>
                <Input
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="cc@example.com"
                  className="flex-1 h-8 border-0 shadow-none focus-visible:ring-0 px-0"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-12">Subject:</span>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="flex-1 h-8 border-0 shadow-none focus-visible:ring-0 px-0 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          {(viewMode === "editor" || viewMode === "split") && (
            <div
              className={cn(
                "flex flex-col",
                viewMode === "split"
                  ? "w-1/2 border-r border-neutral-200 dark:border-neutral-800"
                  : "w-full"
              )}
            >
              {/* Formatting toolbar */}
              <div className="flex items-center gap-0.5 px-4 py-2 border-b border-neutral-100 dark:border-neutral-900">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleBold}
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleItalic}
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleUnderline}
                  title="Underline"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleStrike}
                  title="Strikethrough"
                >
                  <Strikethrough className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-5 mx-1" />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => insertList("bulleted")}
                  title="Bulleted list"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => insertList("numbered")}
                  title="Numbered list"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-5 mx-1" />

                <Button variant="ghost" size="icon" className="h-8 w-8" title="Attach file">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Insert image">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Insert link">
                  <Link2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Insert emoji">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>

              {/* Editor content */}
              <ScrollArea className="flex-1">
                <div className="p-6 max-w-2xl">
                  <YooptaEditor
                    editor={editor}
                    style={{ width: "100%" }}
                    placeholder="Compose your email..."
                  />
                </div>
              </ScrollArea>
            </div>
          )}

          {/* HTML Preview */}
          {(viewMode === "preview" || viewMode === "split") && (
            <div className={cn("flex flex-col", viewMode === "split" ? "w-1/2" : "w-full")}>
              <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-900">
                <span className="text-xs text-muted-foreground font-medium">
                  HTML Preview
                </span>
              </div>
              <ScrollArea className="flex-1 bg-neutral-50 dark:bg-neutral-900">
                <div className="p-6">
                  {/* Email preview container */}
                  <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    {/* Preview header */}
                    <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-muted-foreground">To: </span>
                          <span className="font-medium">{to || "—"}</span>
                        </p>
                        {cc && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Cc: </span>
                            <span>{cc}</span>
                          </p>
                        )}
                        <p className="text-sm">
                          <span className="text-muted-foreground">Subject: </span>
                          <span className="font-semibold">{subject || "—"}</span>
                        </p>
                      </div>
                    </div>
                    {/* Preview body */}
                    <div
                      className="px-6 py-4 prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: htmlPreview }}
                    />
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* Sent confirmation dialog */}
      <Dialog open={showSentDialog} onOpenChange={setShowSentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              Email Sent!
            </DialogTitle>
            <DialogDescription>
              Your email to <span className="font-medium">{to}</span> has been sent
              successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 mt-2">
            <p className="text-sm text-muted-foreground mb-2">Subject:</p>
            <p className="font-medium">{subject}</p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowSentDialog(false)}>
              Close
            </Button>
            <Button onClick={() => { setShowSentDialog(false); handleDiscard(); }}>
              Compose New
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
