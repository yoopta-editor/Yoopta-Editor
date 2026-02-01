"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Sparkles,
  Zap,
  Code2,
  Palette,
  MousePointerClick,
  Keyboard,
  Layers,
} from "lucide-react";
import { Header } from "@/components/landing/header";
import { FullSetupEditor } from "./examples/full-setup/editor";

const features = [
  {
    icon: Zap,
    label: "Lightning Fast",
    description: "Built for performance",
  },
  {
    icon: Code2,
    label: "TypeScript",
    description: "Fully typed",
  },
  {
    icon: Palette,
    label: "Customizable",
    description: "Theme & style",
  },
  {
    icon: MousePointerClick,
    label: "Drag & Drop",
    description: "Reorder blocks",
  },
  {
    icon: Keyboard,
    label: "Shortcuts",
    description: "Keyboard first",
  },
  {
    icon: Layers,
    label: "18+ Plugins",
    description: "Rich blocks",
  },
];

export function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        <div className="text-center max-w-3xl mx-auto mb-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Try it live
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent">
            Interactive Playground
          </h1>
        </div>
      </section>

      {/* Editor Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 dark:from-blue-500/10 dark:via-transparent dark:to-violet-500/10 rounded-3xl blur-3xl" />

            {/* Editor Container */}
            <div className="relative rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl shadow-neutral-200/50 dark:shadow-neutral-900/50 overflow-hidden">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    playground.tsx
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                </div>
              </div>

              {/* Editor Content */}
              <div className="relative min-h-[600px] max-h-[calc(100vh-400px)] overflow-auto bg-white dark:bg-neutral-900">
                <div className="py-12 px-4 sm:px-8 lg:px-12">
                  <FullSetupEditor />
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Like what you see? Get started in minutes.
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
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/Darginec05/Yoopta-Editor"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Star on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
