"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Github,
  Copy,
  Check,
  ChevronDown,
  Star,
} from "lucide-react";

export function Hero() {
  const [copied, setCopied] = React.useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText("npm install @yoopta/editor");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 glow-blue" />
      <div className="absolute inset-0 glow-violet" />
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <a
              href="https://github.com/Darginec05/Yoopta-Editor"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium gap-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <Star className="w-4 h-4 text-amber-500" />
                Star us on GitHub
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Badge>
            </a>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Build{" "}
            <span className="gradient-text">Notion-like</span>
            <br />
            editors in React
          </h1>

          {/* Subheadline */}
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 mb-10">
            Free, open-source rich-text editor with 18+ plugins, drag & drop,
            keyboard shortcuts, and more. Built on Slate.js with a powerful
            plugin architecture.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button variant="primary" size="xl" asChild>
              <Link href="#get-started">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a
                href="https://github.com/Darginec05/Yoopta-Editor"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </Button>
          </div>

          {/* Install command */}
          <div className="flex justify-center mb-12">
            <div
              onClick={copyCommand}
              className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-neutral-900 dark:bg-neutral-800/50 border border-neutral-800 dark:border-neutral-700 cursor-pointer hover:border-neutral-700 dark:hover:border-neutral-600 transition-colors"
            >
              <span className="text-neutral-500 dark:text-neutral-500 font-mono text-sm">
                $
              </span>
              <code className="text-neutral-100 font-mono text-sm">
                npm install @yoopta/editor
              </code>
              <div className="w-px h-4 bg-neutral-700" />
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>MIT License</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>18+ Plugins</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <span>TypeScript</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>React 18+</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="animate-scroll">
            <ChevronDown className="w-6 h-6 text-neutral-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
