"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Users,
  Wand2,
  PanelRightOpen,
  Blocks,
  Store,
  Palette,
  FileCode,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";

const upcomingFeatures = [
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Work together in real-time with your team. See cursors, selections, and changes as they happen.",
  },
  {
    icon: Wand2,
    title: "AI Inline Editing",
    description:
      "Intelligent text suggestions, rewrites, and expansions powered by AI directly in the editor.",
  },
  {
    icon: PanelRightOpen,
    title: "Side Inline Element Editor",
    description:
      "Advanced element editing panel for complex blocks like tabs, carousels, tables, code and embeds.",
  },
  {
    icon: Blocks,
    title: "AI Plugin Prompt Generator",
    description:
      "Generate custom plugins from natural language descriptions. Describe what you need, get working code.",
  },
  {
    icon: Store,
    title: "Plugin Marketplace",
    description:
      "Discover and share plugins with the community. Build once, distribute everywhere.",
  },
  {
    icon: Palette,
    title: "Advanced Theming",
    description:
      "Visual theme builder with live preview. Export themes and share with others.",
  },
  {
    icon: FileCode,
    title: "MDX Export & Import",
    description:
      "Seamlessly export and import MDX content. Perfect for documentation sites, blogs, and content management.",
  },
];

export function Waitlist() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulate API call - replace with actual endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Replace with actual waitlist API
    console.log("Waitlist signup:", email);

    setStatus("success");
    setEmail("");
  };

  return (
    <section id="waitlist" className="relative py-12 sm:py-16">
      {/* Background */}
      <div className="absolute inset-0 glow-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent dark:via-blue-500/10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="info" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
            The future of{" "}
            <span className="gradient-text">Yoopta Editor</span>
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            We&apos;re building powerful features to take your editing experience to
            the next level. Join the waitlist to get early access.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {upcomingFeatures.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300"
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

              {/* Coming soon badge */}
              <div className="absolute top-4 right-4">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                  Soon
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Email signup */}
        <div className="max-w-xl mx-auto">
          <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 shadow-xl shadow-neutral-200/50 dark:shadow-neutral-900/50">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">
                Get early access
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Be the first to know when these features launch. No spam, just updates.
              </p>
            </div>

            {status === "success" ? (
              <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Check className="w-5 h-5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  You&apos;re on the list! We&apos;ll be in touch.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  disabled={status === "loading"}
                  className="shrink-0"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Join Waitlist
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
