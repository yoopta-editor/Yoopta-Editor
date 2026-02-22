"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import YooptaEditor, {
  createYooptaEditor,
  SlateElement,
  YooptaContentValue,
  YooptaPlugin,
  Blocks,
} from "@yoopta/editor";

import { README_PLUGINS } from "./plugins";
import { README_MARKS } from "./marks";
import { applyTheme } from "@yoopta/themes-shadcn";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  Check,
  Download,
  Eye,
  FileText,
  Plus,
  Badge,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Table,
  Terminal,
  BookOpen,
  Rocket,
  Users,
  GitBranch,
  AlertCircle,
  Zap,
  Package,
  Settings,
  FileCode,
  ChevronDown,
  Columns,
  PanelLeft,
  FileType,
} from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_README: YooptaContentValue = {
  "block-1": {
    "id": "block-1",
    "type": "HeadingOne",
    "value": [
      {
        "id": "el-1",
        "type": "heading-one",
        "children": [
          {
            "text": "My Awesome Project"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 0,
      "depth": 0
    }
  },
  "block-2": {
    "id": "block-2",
    "type": "Paragraph",
    "value": [
      {
        "id": "el-2",
        "type": "paragraph",
        "children": [
          {
            "text": "A brief description of what this project does and who it's for. Built with "
          },
          {
            "text": "Yoopta Editor",
            "bold": true
          },
          {
            "text": " - the most powerful rich-text editor."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 1,
      "depth": 0
    }
  },
  "block-7": {
    "id": "block-7",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "el-7",
        "type": "heading-two",
        "children": [
          {
            "text": "Installation"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 6,
      "depth": 0
    }
  },
  "block-8": {
    "id": "block-8",
    "type": "Code",
    "value": [
      {
        "id": "el-8",
        "type": "code",
        "children": [
          {
            "text": "npm install my-awesome-project"
          }
        ],
        "props": {
          "nodeType": "void",
          "language": "bash"
        }
      }
    ],
    "meta": {
      "order": 7,
      "depth": 0
    }
  },
  "block-9": {
    "id": "block-9",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "el-9",
        "type": "heading-two",
        "children": [
          {
            "text": "Usage"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 8,
      "depth": 0
    }
  },
  "block-10": {
    "id": "block-10",
    "type": "Code",
    "value": [
      {
        "id": "el-10",
        "type": "code",
        "children": [
          {
            "text": "import { MyComponent } from 'my-awesome-project';\n\nfunction App() {\n  return <MyComponent />;\n}"
          }
        ],
        "props": {
          "nodeType": "void",
          "language": "typescript"
        }
      }
    ],
    "meta": {
      "order": 9,
      "depth": 0
    }
  },
  "block-11": {
    "id": "block-11",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "el-11",
        "type": "heading-two",
        "children": [
          {
            "text": "License"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 10,
      "depth": 0
    }
  },
  "block-12": {
    "id": "block-12",
    "type": "Paragraph",
    "value": [
      {
        "id": "el-12",
        "type": "paragraph",
        "children": [
          {
            "text": "MIT"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 11,
      "depth": 0
    }
  },
  "f4c51b3d-3947-45d8-aa06-babe7407c4ad": {
    "id": "f4c51b3d-3947-45d8-aa06-babe7407c4ad",
    "type": "NumberedList",
    "value": [
      {
        "id": "ba593386-dd64-4580-b420-5fe22cfe26de",
        "type": "numbered-list",
        "children": [
          {
            "text": "Live markdown preview"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 3
    }
  },
  "c3bf2f48-ff12-4afe-9157-2476dca303b8": {
    "id": "c3bf2f48-ff12-4afe-9157-2476dca303b8",
    "type": "NumberedList",
    "value": [
      {
        "id": "e6ebf60b-1eb0-4060-87ac-07866f237c27",
        "type": "numbered-list",
        "children": [
          {
            "text": "Export to markdown with one click"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 4
    }
  },
  "81c4988a-eeea-404d-bd2c-379a95e8761c": {
    "id": "81c4988a-eeea-404d-bd2c-379a95e8761c",
    "type": "NumberedList",
    "value": [
      {
        "id": "29f96ec0-6fef-4354-93b7-1c4fedf79c9a",
        "type": "numbered-list",
        "children": [
          {
            "text": "Quick insert for badges, sections and more"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 5
    }
  },
  "8c9b1f31-f479-45c7-979a-40ed29eee64a": {
    "id": "8c9b1f31-f479-45c7-979a-40ed29eee64a",
    "type": "HeadingTwo",
    "meta": {
      "depth": 0,
      "order": 2
    },
    "value": [
      {
        "id": "df52c486-c7b0-4af6-85fb-d16c069088d0",
        "type": "heading-two",
        "props": {
          "withAnchor": false
        },
        "children": [
          {
            "text": "Features"
          }
        ]
      }
    ]
  }
}

// Badge templates
const BADGE_TEMPLATES = [
  {
    name: "npm version",
    markdown: "![npm version](https://img.shields.io/npm/v/PACKAGE_NAME.svg)",
  },
  {
    name: "npm downloads",
    markdown: "![npm downloads](https://img.shields.io/npm/dm/PACKAGE_NAME.svg)",
  },
  {
    name: "license",
    markdown: "![license](https://img.shields.io/badge/license-MIT-blue.svg)",
  },
  {
    name: "build status",
    markdown: "![build](https://img.shields.io/github/actions/workflow/status/USER/REPO/ci.yml)",
  },
  {
    name: "stars",
    markdown: "![stars](https://img.shields.io/github/stars/USER/REPO.svg)",
  },
  {
    name: "TypeScript",
    markdown: "![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)",
  },
  {
    name: "React",
    markdown: "![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)",
  },
  {
    name: "PRs Welcome",
    markdown: "![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)",
  },
];

// Section templates
const SECTION_TEMPLATES = [
  { name: "Installation", icon: Package, heading: "Installation" },
  { name: "Usage", icon: Rocket, heading: "Usage" },
  { name: "Features", icon: Zap, heading: "Features" },
  { name: "API Reference", icon: BookOpen, heading: "API Reference" },
  { name: "Configuration", icon: Settings, heading: "Configuration" },
  { name: "Examples", icon: FileCode, heading: "Examples" },
  { name: "Contributing", icon: Users, heading: "Contributing" },
  { name: "License", icon: FileText, heading: "License" },
  { name: "Changelog", icon: GitBranch, heading: "Changelog" },
  { name: "FAQ", icon: AlertCircle, heading: "FAQ" },
];

export function ReadmeEditor() {
  const [markdown, setMarkdown] = useState("");
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [copied, setCopied] = useState(false);

  const editor = useMemo(() => {
    return createYooptaEditor({
      plugins: applyTheme(README_PLUGINS) as unknown as YooptaPlugin<
        Record<string, SlateElement>,
        unknown
      >[],
      marks: README_MARKS,
    });
  }, []);

  // Update markdown preview when content changes
  const updateMarkdown = useCallback(() => {
    const content = editor.getEditorValue();
    const md = editor.getMarkdown(content);
    setMarkdown(md);
  }, [editor]);

  useEffect(() => {
    editor.setEditorValue(INITIAL_README);
    // Initial markdown generation
    setTimeout(updateMarkdown, 100);
  }, [editor, updateMarkdown]);

  // Subscribe to changes
  useEffect(() => {
    editor.on("change", updateMarkdown);
    return () => {
      editor.off("change", updateMarkdown);
    };
  }, [editor, updateMarkdown]);

  const handleCopyMarkdown = useCallback(async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [markdown]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown]);

  // Insert helpers
  const insertHeading = (level: 1 | 2 | 3) => {
    const types = { 1: "HeadingOne", 2: "HeadingTwo", 3: "HeadingThree" };
    Blocks.insertBlock(editor, types[level], { focus: true });
  };

  const insertCodeBlock = (language: string) => {
    Blocks.insertBlock(editor, "Code", {
      focus: true,
      blockData: {
        value: [
          {
            id: crypto.randomUUID(),
            type: "code",
            children: [{ text: "" }],
            props: { nodeType: "void", language },
          },
        ],
      },
    });
  };

  const insertSection = (heading: string) => {
    Blocks.insertBlock(editor, "HeadingTwo", {
      focus: true,
      blockData: {
        value: [
          {
            id: crypto.randomUUID(),
            type: "heading-two",
            children: [{ text: heading }],
            props: { nodeType: "block" },
          },
        ],
      },
    });
  };

  const insertBadge = (badgeMarkdown: string) => {
    Blocks.insertBlock(editor, "Paragraph", {
      focus: true,
      blockData: {
        value: [
          {
            id: crypto.randomUUID(),
            type: "paragraph",
            children: [{ text: badgeMarkdown }],
            props: { nodeType: "block" },
          },
        ],
      },
    });
  };

  const insertList = (type: "bulleted" | "numbered") => {
    Blocks.insertBlock(editor, type === "bulleted" ? "BulletedList" : "NumberedList", { focus: true });
  };

  const insertBlockquote = () => {
    Blocks.insertBlock(editor, "Blockquote", { focus: true });
  };

  const insertTable = () => {
    Blocks.insertBlock(editor, "Table", { focus: true });
  };

  const insertDivider = () => {
    Blocks.insertBlock(editor, "Divider", { focus: true });
  };

  const insertCallout = () => {
    Blocks.insertBlock(editor, "Callout", { focus: true });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Toolbar - wraps on mobile */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 sm:px-4 py-2 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Insert Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Insert
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Heading1 className="h-4 w-4 mr-2" />
                    Headings
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => insertHeading(1)}>
                      <Heading1 className="h-4 w-4 mr-2" />
                      Heading 1
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertHeading(2)}>
                      <Heading2 className="h-4 w-4 mr-2" />
                      Heading 2
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertHeading(3)}>
                      <Heading3 className="h-4 w-4 mr-2" />
                      Heading 3
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Code className="h-4 w-4 mr-2" />
                    Code Block
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => insertCodeBlock("typescript")}>
                      TypeScript
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertCodeBlock("javascript")}>
                      JavaScript
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertCodeBlock("bash")}>
                      Bash
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertCodeBlock("python")}>
                      Python
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertCodeBlock("json")}>
                      JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertCodeBlock("yaml")}>
                      YAML
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => insertList("bulleted")}>
                  <List className="h-4 w-4 mr-2" />
                  Bulleted List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertList("numbered")}>
                  <ListOrdered className="h-4 w-4 mr-2" />
                  Numbered List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={insertBlockquote}>
                  <Quote className="h-4 w-4 mr-2" />
                  Blockquote
                </DropdownMenuItem>
                <DropdownMenuItem onClick={insertTable}>
                  <Table className="h-4 w-4 mr-2" />
                  Table
                </DropdownMenuItem>
                <DropdownMenuItem onClick={insertCallout}>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Callout / Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={insertDivider}>
                  <span className="h-4 w-4 mr-2 flex items-center justify-center">—</span>
                  Divider
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sections Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <BookOpen className="h-4 w-4" />
                  Sections
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {SECTION_TEMPLATES.map((section) => {
                  const Icon = section.icon;
                  return (
                    <DropdownMenuItem
                      key={section.name}
                      onClick={() => insertSection(section.heading)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {section.name}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Badges Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Badge className="h-4 w-4" />
                  Badges
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {BADGE_TEMPLATES.map((badge) => (
                  <DropdownMenuItem
                    key={badge.name}
                    onClick={() => insertBadge(badge.markdown)}
                  >
                    {badge.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

            {/* Quick insert buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => insertCodeBlock("bash")}
              title="Code block"
            >
              <Terminal className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={insertTable}
              title="Table"
            >
              <Table className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => insertList("bulleted")}
              title="List"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View mode toggle — mobile only, desktop always shows split */}
            <div className="flex md:hidden items-center border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 rounded-none border-r border-neutral-200 dark:border-neutral-800",
                  viewMode === "editor" && "bg-neutral-100 dark:bg-neutral-800"
                )}
                onClick={() => setViewMode("editor")}
                title="Editor only"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 rounded-none border-r border-neutral-200 dark:border-neutral-800",
                  viewMode === "split" && "bg-neutral-100 dark:bg-neutral-800"
                )}
                onClick={() => setViewMode("split")}
                title="Split view"
              >
                <Columns className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 rounded-none",
                  viewMode === "preview" && "bg-neutral-100 dark:bg-neutral-800"
                )}
                onClick={() => setViewMode("preview")}
                title="Preview only"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Export actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyMarkdown}
              className="gap-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy MD
                </>
              )}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              className="gap-1"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Main content area - mobile: controlled by viewMode, desktop: always split */}
      {/* <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden"> */}
      <div className="flex-1 flex flex-row min-h-0 overflow-hidden">
        {/* Editor Panel — always visible on md+, mobile respects viewMode */}
        <div
          className={cn(
            "flex-col flex-1 min-h-0 md:border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 md:w-1/2",
            viewMode === "preview" ? "hidden md:flex" : "flex",
            viewMode === "editor" ? "w-full md:w-1/2" : "w-full md:w-1/2"
          )}
        >
          <div className="px-3 sm:px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shrink-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4 shrink-0" />
              <span className="font-medium truncate">README.md</span>
              <span className="text-xs hidden sm:inline">— Editor</span>
            </div>
          </div>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 sm:p-6 max-w-3xl mx-auto">
              <YooptaEditor
                editor={editor}
                style={{ width: "100%" }}
                placeholder="Start writing your README..."
                onChange={(value) => console.log(value)}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Preview Panel — always visible on md+, mobile respects viewMode */}
        <div
          className={cn(
            "flex-col flex-1 min-h-0 bg-white dark:bg-neutral-950 md:w-1/2",
            viewMode === "editor" ? "hidden md:flex" : "flex",
            viewMode === "preview" ? "w-full md:w-1/2" : "w-full md:w-1/2"
          )}
        >
          <div className="px-3 sm:px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shrink-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4 shrink-0" />
              <span className="font-medium">Preview</span>
              <span className="text-xs hidden sm:inline">— Markdown Output</span>
            </div>
          </div>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 sm:p-6">
              <div className="max-w-3xl mx-auto">
                {/* GitHub-style markdown preview */}
                <div className="prose prose-neutral dark:prose-invert prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-code:before:content-none prose-code:after:content-none max-w-none prose-pre:text-xs sm:prose-pre:text-sm">
                  <pre className="bg-neutral-100 dark:bg-neutral-900 p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm font-mono whitespace-pre-wrap wrap-break-word">
                    {markdown || "# Your README preview will appear here..."}
                  </pre>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Footer stats - wraps on mobile */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 sm:px-4 py-1.5 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5">
            <span>{Object.keys(editor.getEditorValue()).length} blocks</span>
            <span>{markdown.length} characters</span>
            <span>{markdown.split("\n").length} lines</span>
          </div>
          <div className="flex items-center gap-2">
            <FileType className="h-3 w-3 shrink-0" />
            <span className="truncate">GitHub Flavored Markdown</span>
          </div>
        </div>
      </div>
    </div>
  );
}
