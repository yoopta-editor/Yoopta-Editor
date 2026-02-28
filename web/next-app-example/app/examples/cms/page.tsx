"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wand2,
  Store,
  PanelRightOpen,
  Palette,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Bot,
  Blocks,
  Puzzle,
  Rocket,
} from "lucide-react";

const TALLY_FORM_ID = "RGPj8v";

const roadmapItems = [
  {
    icon: Bot,
    title: "AI Content Agent",
    description:
      "An AI agent that builds and edits pages for you — like Lovable, but with inline editing and a rich plugin ecosystem. Describe what you want and watch it assemble layouts, write copy, and style blocks in real time.",
  },
  {
    icon: Puzzle,
    title: "Dozens of New Plugins",
    description:
      "We're building a growing library of content blocks — pricing tables, testimonials, hero sections, FAQ accordions, charts, forms, and more — all drag-and-drop ready.",
  },
  {
    icon: Store,
    title: "Plugin Marketplace",
    description:
      "Publish your own plugins or install community-built ones. A shared ecosystem where anyone can extend the CMS with custom blocks, integrations, and themes.",
  },
  {
    icon: Palette,
    title: "Visual Theme Builder",
    description:
      "Design themes with a live preview — tweak fonts, colors, spacing, and layout. Export and share themes or apply community ones in a click.",
  },
];

export default function CMSExamplePage() {
  React.useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://tally.so/widgets/embed.js"]'
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const openTallyPopup = () => {
    if (typeof window !== "undefined" && (window as any).Tally) {
      (window as any).Tally.openPopup(TALLY_FORM_ID, {
        layout: "modal",
        width: 500,
        autoClose: 3000,
      });
    } else {
      window.open(`https://tally.so/r/${TALLY_FORM_ID}`, "_blank");
    }
  };

  return (
    <div className="min-h-full bg-white">
      {/* Hero */}
      <section className="relative px-6 py-14 sm:py-16 text-center">
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 mb-6">
            <Rocket className="size-3" />
            Early Preview
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-5">
            Yoopta CMS
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Build websites with a visual editor powered by Yoopta&apos;s plugin
            architecture. Drag blocks, tweak styles in the sidebar, and publish
            — no code required.
          </p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/cms-editor"
            target="_blank"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-lg text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 shadow-sm transition-all"
          >
            Try the Demo
            <ExternalLink className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* Current state callout */}
      <section className="px-6 pb-12 max-w-3xl mx-auto">
        <div className="p-6 rounded-xl border border-amber-200 bg-amber-50/50">
          <p className="text-sm text-neutral-700 leading-relaxed">
            <span className="font-semibold text-neutral-900">This is an early demo.</span>{" "}
            What you see today is a basic CMS editor with a handful of content blocks and
            a sidebar for page settings. But this is just the starting point — we have a
            big vision for where Yoopta CMS is headed.
          </p>
        </div>
      </section>

      {/* Vision section */}
      <section className="px-6 pb-8 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
          Where we&apos;re going
        </h2>
        <p className="text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          Think of it as Lovable — but with true inline editing, a rich plugin system, and
          an AI agent that can manipulate every block on your page. We&apos;re building
          dozens of new plugins, a marketplace to share them, and an AI layer that turns
          natural language into fully styled pages.
        </p>
      </section>

      {/* Roadmap cards */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {roadmapItems.map((item) => (
            <div
              key={item.title}
              className="group p-6 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200"
            >
              <div className="mb-3 inline-flex items-center justify-center size-10 rounded-lg bg-blue-100/80 text-blue-600 group-hover:bg-blue-200/80 transition-colors">
                <item.icon className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-24 max-w-md mx-auto text-center">
        <p className="text-sm text-neutral-500 mb-5">
          Want to shape the future of Yoopta CMS? Join the waitlist for early access
          and help us decide what to build next.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={openTallyPopup}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-lg text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 shadow-sm transition-all"
          >
            Join Waitlist
            <ArrowRight className="size-3.5" />
          </button>
          <Link
            href="/cms-editor"
            target="_blank"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-lg text-sm font-semibold text-neutral-700 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100 transition-all"
          >
            Try the Demo
            <ExternalLink className="size-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
