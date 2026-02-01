"use client";

import * as React from "react";
import {
  Blocks,
  Keyboard,
  Palette,
  FileCode2,
  Smartphone,
  Zap,
  GripVertical,
  FileOutput,
  History,
  Code2,
  MousePointerClick,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: Blocks,
    title: "20+ Block Plugins",
    description:
      "Paragraph, headings, lists, code, images, videos, tables, accordions, and more out of the box.",
  },
  {
    icon: GripVertical,
    title: "Drag & Drop",
    description:
      "Intuitive drag and drop to reorder blocks. Supports nested structures with indentation and multi-block drag and drop.",
  },
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    description:
      "Full keyboard navigation. Markdown shortcuts, formatting hotkeys, and customizable bindings.",
  },
  {
    icon: FileOutput,
    title: "Export Anywhere",
    description:
      "Export to HTML, Markdown, plain text, or email-compatible HTML. Custom serializers supported.",
  },
  {
    icon: Code2,
    title: "Programmatic API",
    description:
      "Full control with Editor API, Blocks API, Elements API, Plugin Commands API, Marks API",
  },
  {
    icon: Palette,
    title: "Theming",
    description:
      "Light and dark themes. Theme presets like Shadcn UI, Material UI (in progress) and other",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Responsive design that works on all devices. Touch-optimized interactions.",
  },
  {
    icon: Zap,
    title: "Performant",
    description:
      "Handles large documents smoothly.",
  },
  {
    icon: History,
    title: "Undo/Redo",
    description:
      "Full history support with undo/redo. Batch operations for complex changes.",
  },
  {
    icon: FileCode2,
    title: "TypeScript",
    description:
      "Written in TypeScript with full type definitions. Great DX and IntelliSense.",
  },
  {
    icon: MousePointerClick,
    title: "Selection Box",
    description:
      "Multi-block selection with drag selection box. Bulk operations on selected blocks.",
  },
  {
    icon: Layers,
    title: "Plugin Architecture",
    description:
      "Create custom plugins with custom renders, shortcuts, and behaviors.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-12 sm:py-16">
      {/* Background */}
      <div className="absolute inset-0 glow-center" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
            Everything you need to build
            <br />
            <span className="gradient-text">modern editors</span>
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Yoopta comes with all the features you need to create rich text
            editing experiences, without the complexity.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Icon */}
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 dark:from-blue-500/20 dark:to-violet-500/20 group-hover:from-blue-500/20 group-hover:to-violet-500/20 dark:group-hover:from-blue-500/30 dark:group-hover:to-violet-500/30 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
