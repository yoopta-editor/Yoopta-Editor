"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, X, Minus } from "lucide-react";

type FeatureStatus = "yes" | "no" | "partial";

interface ComparisonFeature {
  name: string;
  description?: string;
  yoopta: FeatureStatus;
  tiptap: FeatureStatus;
  lexical: FeatureStatus;
  quill: FeatureStatus;
}

const comparisonFeatures: ComparisonFeature[] = [
  {
    name: "100% Free & Open Source",
    description: "All features free, no paid tiers",
    yoopta: "yes",
    tiptap: "partial",
    lexical: "yes",
    quill: "yes",
  },
  {
    name: "Block-based Architecture",
    description: "Notion-like block editing",
    yoopta: "yes",
    tiptap: "partial",
    lexical: "partial",
    quill: "no",
  },
  {
    name: "20+ Ready Plugins",
    description: "Tables, accordions, tabs, code, etc.",
    yoopta: "yes",
    tiptap: "partial",
    lexical: "no",
    quill: "no",
  },
  {
    name: "Drag & Drop Blocks",
    description: "Reorder with drag handles",
    yoopta: "yes",
    tiptap: "partial",
    lexical: "no",
    quill: "no",
  },
  {
    name: "Multi-block Selection",
    description: "Select multiple blocks at once",
    yoopta: "yes",
    tiptap: "no",
    lexical: "no",
    quill: "no",
  },
  {
    name: "Theme Presets",
    description: "shadcn, Material UI themes",
    yoopta: "yes",
    tiptap: "no",
    lexical: "no",
    quill: "no",
  },
  {
    name: "Nested Block Content",
    description: "Blocks inside accordions, tabs, etc.",
    yoopta: "yes",
    tiptap: "partial",
    lexical: "partial",
    quill: "no",
  },
  {
    name: "Pre-built UI Components",
    description: "Toolbar, slash menu, block options",
    yoopta: "yes",
    tiptap: "partial",
    lexical: "no",
    quill: "partial",
  },
  {
    name: "Export HTML/Markdown/Email",
    description: "Multiple export formats",
    yoopta: "yes",
    tiptap: "partial",
    lexical: "partial",
    quill: "partial",
  },
  {
    name: "TypeScript First",
    description: "Full type safety",
    yoopta: "yes",
    tiptap: "yes",
    lexical: "yes",
    quill: "no",
  },
  {
    name: "Modern React (18+)",
    description: "Hooks, concurrent features",
    yoopta: "yes",
    tiptap: "yes",
    lexical: "yes",
    quill: "partial",
  },
  {
    name: "Low Learning Curve",
    description: "Quick to get started",
    yoopta: "yes",
    tiptap: "partial",
    lexical: "no",
    quill: "yes",
  },
  {
    name: "Mobile Friendly",
    description: "Touch-optimized, responsive",
    yoopta: "yes",
    tiptap: "yes",
    lexical: "partial",
    quill: "partial",
  },
  {
    name: "Custom CMS-like Plugins",
    description: "Build complex block types easily",
    yoopta: "yes",
    tiptap: "partial",
    lexical: "partial",
    quill: "no",
  },
];

const StatusIcon = ({ status }: { status: FeatureStatus }) => {
  if (status === "yes") {
    return (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10">
        <Check className="w-4 h-4 text-emerald-500" />
      </div>
    );
  }
  if (status === "partial") {
    return (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10">
        <Minus className="w-4 h-4 text-amber-500" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-500/10">
      <X className="w-4 h-4 text-neutral-400" />
    </div>
  );
};

export function Comparison() {
  return (
    <section id="comparison" className="relative py-12 sm:py-16">
      {/* Background */}
      <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-900/50" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Comparison
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
            Why choose Yoopta?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Yoopta gives you everything out of the box: 20+ plugins, pre-built UI,
            theme presets, and a Notion-like editing experience — all 100% free.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                  Feature
                </th>
                <th className="text-center py-4 px-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Yoopta
                    </span>
                  </div>
                </th>
                <th className="text-center py-4 px-4">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    TipTap
                  </span>
                </th>
                <th className="text-center py-4 px-4">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Lexical
                  </span>
                </th>
                <th className="text-center py-4 px-4">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Quill
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, index) => (
                <tr
                  key={feature.name}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-neutral-900/30"
                      : "bg-neutral-50 dark:bg-neutral-800/20"
                  }
                >
                  <td className="py-3 px-4">
                    <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {feature.name}
                    </div>
                    {feature.description && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-500">
                        {feature.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.yoopta} />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.tiptap} />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.lexical} />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.quill} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <StatusIcon status="yes" />
            <span>Full support</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon status="partial" />
            <span>Partial / Paid</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon status="no" />
            <span>Not included</span>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-500 mt-6">
          Comparison based on default/free offerings. All frameworks are excellent choices depending on your needs.
        </p>
      </div>
    </section>
  );
}
