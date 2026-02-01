"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Image,
  Video,
  FileText,
  Table2,
  ChevronDown,
  Columns,
  ListTree,
  Minus,
  Link2,
  AtSign,
  ImageIcon,
  AlertCircle,
} from "lucide-react";

const pluginCategories = [
  {
    name: "Text",
    description: "Basic text formatting blocks",
    plugins: [
      { name: "Paragraph", icon: Type, package: "@yoopta/paragraph" },
      { name: "Heading 1", icon: Heading1, package: "@yoopta/headings" },
      { name: "Heading 2", icon: Heading2, package: "@yoopta/headings" },
      { name: "Heading 3", icon: Heading3, package: "@yoopta/headings" },
      { name: "Blockquote", icon: Quote, package: "@yoopta/blockquote" },
    ],
  },
  {
    name: "Lists",
    description: "Organized content blocks",
    plugins: [
      { name: "Bulleted List", icon: List, package: "@yoopta/lists" },
      { name: "Numbered List", icon: ListOrdered, package: "@yoopta/lists" },
      { name: "Todo List", icon: CheckSquare, package: "@yoopta/lists" },
    ],
  },
  {
    name: "Media",
    description: "Rich media embeds",
    plugins: [
      { name: "Image", icon: Image, package: "@yoopta/image" },
      { name: "Video", icon: Video, package: "@yoopta/video" },
      { name: "Embed", icon: Link2, package: "@yoopta/embed" },
      { name: "File", icon: FileText, package: "@yoopta/file" },
      { name: "Carousel", icon: ImageIcon, package: "@yoopta/carousel" },
    ],
  },
  {
    name: "Advanced",
    description: "Complex structured blocks",
    plugins: [
      { name: "Table", icon: Table2, package: "@yoopta/table" },
      { name: "Code", icon: Code, package: "@yoopta/code" },
      { name: "Code Group", icon: Code, package: "@yoopta/code-group" },
      { name: "Accordion", icon: ChevronDown, package: "@yoopta/accordion" },
      { name: "Tabs", icon: Columns, package: "@yoopta/tabs" },
      { name: "Steps", icon: ListTree, package: "@yoopta/steps" },
      { name: "Callout", icon: AlertCircle, package: "@yoopta/callout" },
      { name: "Divider", icon: Minus, package: "@yoopta/divider" },
    ],
  },
  {
    name: "Inline",
    description: "Inline elements within text",
    plugins: [
      { name: "Link", icon: Link2, package: "@yoopta/link" },
      { name: "Mention", icon: AtSign, package: "@yoopta/mention" },
    ],
  },
];

export function Plugins() {
  return (
    <section id="plugins" className="relative py-12 sm:py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-900/50" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="info" className="mb-4">
            18+ Plugins
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
            Every block type you need
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            From simple paragraphs to complex tables and accordions. Mix and
            match plugins to build your perfect editor.
          </p>
        </div>

        {/* Plugin categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pluginCategories.map((category) => (
            <div
              key={category.name}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80"
            >
              <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">{category.name}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {category.description}
              </p>
              <div className="space-y-2">
                {category.plugins.map((plugin) => (
                  <div
                    key={plugin.name}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
                      <plugin.icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{plugin.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 truncate font-mono">
                        {plugin.package}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Marks section */}
        <div className="mt-12 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Text Formatting (Marks)</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Apply formatting to any text selection
              </p>
            </div>
            <code className="text-xs font-mono text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
              @yoopta/marks
            </code>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Bold", shortcut: "⌘B", style: "font-bold" },
              { name: "Italic", shortcut: "⌘I", style: "italic" },
              { name: "Underline", shortcut: "⌘U", style: "underline" },
              { name: "Strike", shortcut: "⌘⇧S", style: "line-through" },
              { name: "Code", shortcut: "⌘E", style: "font-mono bg-neutral-200 dark:bg-neutral-700 px-1 rounded" },
              { name: "Highlight", shortcut: "⌘⇧H", style: "bg-yellow-200 dark:bg-yellow-500/30" },
            ].map((mark) => (
              <div
                key={mark.name}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50"
              >
                <span className={mark.style}>{mark.name}</span>
                <kbd className="text-xs text-neutral-500 bg-neutral-200 dark:bg-neutral-700 px-1.5 py-0.5 rounded">
                  {mark.shortcut}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
