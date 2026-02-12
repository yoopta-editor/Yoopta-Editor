"use client";

import { useMemo, useRef } from "react";
import { generateId } from "@yoopta/editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Zap,
  Github,
  ExternalLink,
  Code2,
  Info,
} from "lucide-react";
import { CollaborationEditor } from "./collaboration-editor";

const NAMES = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Eve",
  "Frank",
  "Grace",
  "Hank",
  "Iris",
  "Jack",
  "Kara",
  "Leo",
  "Mia",
  "Noah",
  "Olive",
  "Paul",
];

const COLORS = [
  "#E57373",
  "#F06292",
  "#BA68C8",
  "#7986CB",
  "#64B5F6",
  "#4FC3F7",
  "#4DD0E1",
  "#4DB6AC",
  "#81C784",
  "#AED581",
  "#FFD54F",
  "#FFB74D",
  "#FF8A65",
  "#A1887F",
];

export const CollaborationPage = () => {
  const containerBoxRef = useRef<HTMLDivElement | null>(null);

  const user = useMemo(
    () => ({
      id: generateId(),
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        <div className="text-center max-w-3xl mx-auto mb-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Real-time
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent">
            Collaborative Editing
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Edit together in real-time. Open this page in multiple tabs or
            share the URL with others to see collaboration in action.
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: user.color }}
            />
            <span className="text-sm text-muted-foreground">
              You are{" "}
              <span className="font-semibold text-foreground">
                {user.name}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Editor Card */}
      <section
        className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8"
        ref={containerBoxRef}
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 dark:from-blue-500/10 dark:via-transparent dark:to-violet-500/10 rounded-3xl blur-3xl" />

            <div className="relative rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl shadow-neutral-200/50 dark:shadow-neutral-900/50 overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    collaboration.tsx
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                  <Badge variant="warning" className="text-xs">
                    v6 (beta)
                  </Badge>
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    <a
                      href="https://github.com/Darginec05/Yoopta-Editor/tree/main/web/next-app-example/components/playground/examples/collaboration"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Source Code
                    </a>
                  </Badge>
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    <a
                      href="https://github.com/Darginec05/Yoopta-Editor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Github className="w-3 h-3 mr-1" />
                      Star Repository
                    </a>
                  </Badge>
                </div>
              </div>

              {/* Editor body */}
              <div className="relative min-h-[600px] max-h-[calc(100vh-400px)] overflow-auto bg-white dark:bg-neutral-900">
                <div className="pt-0 pb-8 px-4 sm:px-8 lg:px-12">
                  <CollaborationEditor
                    user={user}
                    containerBoxRef={
                      containerBoxRef as React.RefObject<HTMLDivElement>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Instructions callout */}
          <div className="mt-6 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  How to test collaboration
                </h3>
                <ol className="space-y-1.5 text-sm text-muted-foreground list-decimal list-inside">
                  <li>
                    Open this same page in a{" "}
                    <span className="font-medium text-foreground">
                      second browser tab
                    </span>
                  </li>
                  <li>
                    Each tab gets a random identity &mdash; you&apos;ll see both
                    users in the status bar
                  </li>
                  <li>
                    Start typing in one tab and watch the text appear in the
                    other in real-time
                  </li>
                  <li>
                    Notice the colored cursor and name label of the remote user
                  </li>
                  <li>
                    Share the URL with a friend to collaborate across devices
                  </li>
                </ol>
                <p className="mt-3 text-xs text-muted-foreground">
                  Powered by{" "}
                  <a
                    href="https://yjs.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    Yjs
                  </a>{" "}
                  &amp; the free Yjs demo server. No backend setup required.
                </p>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Add real-time collaboration to your editor in minutes.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button asChild>
                <a
                  href="https://docs.yoopta.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  View Documentation
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
