"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  BookOpen,
  MessageSquare,
  MessagesSquare,
  FileEdit,
  Users,
  LayoutDashboard,
  PanelLeft,
  ChevronLeft,
  Blocks,
  ExternalLink,
  Github,
  Code2,
  ScrollText,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const GITHUB_BASE =
  "https://github.com/Darginec05/Yoopta-Editor/tree/master/web/next-app-example/components/playground/examples";

const EXAMPLES = [
  {
    title: "Full Setup",
    href: "/examples/full-setup",
    icon: LayoutDashboard,
    sourceFolder: "full-setup",
  },
  {
    title: "Nested Plugin Elements",
    href: "/examples/inject-plugins",
    icon: Blocks,
    sourceFolder: "inject-plugins",
  },
  // {
  //   title: "Email Builder",
  //   href: "/examples/email-builder",
  //   icon: Mail,
  //   sourceFolder: "email-builder",
  // },
  {
    title: "Markdown Editor",
    href: "/examples/readme-editor",
    icon: BookOpen,
    sourceFolder: "readme-editor",
  },
  {
    title: "Slack Chat",
    href: "/examples/slack-chat",
    icon: MessageSquare,
    sourceFolder: "slack-chat",
  },
  {
    title: "Social Media Chat",
    href: "/examples/social-media-chat",
    icon: MessagesSquare,
    sourceFolder: "social-media-chat",
  },
  {
    title: "MS Word Example",
    href: "/examples/word-example",
    icon: FileEdit,
    sourceFolder: "word-example",
  },
  {
    title: "Collaboration",
    href: "/examples/collaboration",
    icon: Users,
    sourceFolder: "collaboration",
  },
  {
    title: "Large Document",
    href: "/examples/large-document",
    icon: ScrollText,
    sourceFolder: "large-document",
  },
];

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const currentExample = EXAMPLES.find((e) => pathname === e.href);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-neutral-200 bg-neutral-50 transition-[width] duration-200 ease-in-out shrink-0 overflow-hidden",
          collapsed ? "w-14" : "w-60"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-12 px-3 border-b border-neutral-200 shrink-0">
          {!collapsed && (
            <Link
              href="/examples"
              className="text-sm font-semibold text-neutral-900 truncate"
            >
              Examples
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex items-center justify-center size-7 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/70 transition-colors",
              collapsed && "mx-auto"
            )}
          >
            {collapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          <ul className="flex flex-col gap-0.5">
            {EXAMPLES.map((example) => {
              const isActive = pathname === example.href;
              const Icon = example.icon;

              return (
                <li key={example.href}>
                  <Link
                    href={example.href}
                    title={collapsed ? example.title : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 h-8 text-[13px] font-medium transition-colors truncate",
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {!collapsed && <span className="truncate">{example.title}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-auto">{children}</div>

        {/* Bottom bar */}
        <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-neutral-200 bg-neutral-50 shrink-0">
          {currentExample && (
            <a
              href={`${GITHUB_BASE}/${currentExample.sourceFolder}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70 transition-colors"
            >
              <ExternalLink className="size-3.5" />
              Source Code
            </a>
          )}
          <a
            href="https://docs.yoopta.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70 transition-colors"
          >
            <Code2 className="size-3.5" />
            Docs
          </a>
          <a
            href="https://github.com/Darginec05/Yoopta-Editor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70 transition-colors"
          >
            <Github className="size-3.5" />
            Star Repo
          </a>
        </div>
      </main>
    </div>
  );
}
