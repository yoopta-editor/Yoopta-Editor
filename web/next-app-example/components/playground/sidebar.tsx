"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  FileText,
  Heading,
  List,
  Quote,
  Code,
  Image,
  Video,
  Table2,
  ChevronDown,
  Columns,
  ListTree,
  AlertCircle,
  Palette,
  Keyboard,
  FileOutput,
  Wand2,
  LayoutTemplate,
  Blocks,
} from "lucide-react";

interface ExampleItem {
  name: string;
  slug: string;
  icon: React.ElementType;
  description?: string;
}

interface ExampleCategory {
  title: string;
  items: ExampleItem[];
}

const examples: ExampleCategory[] = [
  {
    title: "Getting Started",
    items: [
      {
        name: "Basic Setup",
        slug: "basic",
        icon: FileText,
        description: "Minimal editor setup",
      },
      {
        name: "With Toolbar",
        slug: "with-toolbar",
        icon: LayoutTemplate,
        description: "Editor with formatting toolbar",
      },
      {
        name: "Full Setup",
        slug: "full-setup",
        icon: Blocks,
        description: "All plugins and UI components",
      },
    ],
  },
  {
    title: "Plugins",
    items: [
      {
        name: "Headings",
        slug: "headings",
        icon: Heading,
        description: "H1, H2, H3 headings",
      },
      {
        name: "Lists",
        slug: "lists",
        icon: List,
        description: "Bulleted, numbered, todo",
      },
      {
        name: "Blockquote",
        slug: "blockquote",
        icon: Quote,
        description: "Quote blocks",
      },
      {
        name: "Code",
        slug: "code",
        icon: Code,
        description: "Syntax highlighted code",
      },
      {
        name: "Images",
        slug: "images",
        icon: Image,
        description: "Image blocks with upload",
      },
      {
        name: "Videos",
        slug: "videos",
        icon: Video,
        description: "YouTube, Vimeo embeds",
      },
      {
        name: "Tables",
        slug: "tables",
        icon: Table2,
        description: "Data tables",
      },
      {
        name: "Accordion",
        slug: "accordion",
        icon: ChevronDown,
        description: "Collapsible sections",
      },
      {
        name: "Tabs",
        slug: "tabs",
        icon: Columns,
        description: "Tabbed content",
      },
      {
        name: "Steps",
        slug: "steps",
        icon: ListTree,
        description: "Step-by-step guides",
      },
      {
        name: "Callout",
        slug: "callout",
        icon: AlertCircle,
        description: "Alert boxes",
      },
    ],
  },
  {
    title: "Features",
    items: [
      {
        name: "Theming",
        slug: "theming",
        icon: Palette,
        description: "Light and dark themes",
      },
      {
        name: "Shortcuts",
        slug: "shortcuts",
        icon: Keyboard,
        description: "Keyboard shortcuts",
      },
      {
        name: "Export",
        slug: "export",
        icon: FileOutput,
        description: "HTML, Markdown export",
      },
      {
        name: "Read Only",
        slug: "read-only",
        icon: FileText,
        description: "Read-only mode",
      },
    ],
  },
  {
    title: "Advanced",
    items: [
      {
        name: "Custom Plugin",
        slug: "custom-plugin",
        icon: Blocks,
        description: "Create custom plugins",
      },
      {
        name: "AI Generation",
        slug: "ai-generation",
        icon: Wand2,
        description: "AI content generation",
      },
    ],
  },
];

export function PlaygroundSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
            <span className="text-white font-bold text-sm">Y</span>
          </div>
          <span className="font-semibold text-neutral-900 dark:text-white">Playground</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-6">
          {examples.map((category) => (
            <div key={category.title}>
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {category.title}
              </h3>
              <nav className="space-y-1">
                {category.items.map((item) => {
                  const isActive = pathname === `/playground/${item.slug}`;
                  return (
                    <Link
                      key={item.slug}
                      href={`/playground/${item.slug}`}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}

export { examples };
