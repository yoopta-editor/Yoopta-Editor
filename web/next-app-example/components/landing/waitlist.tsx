import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  MousePointer2,
  Layers,
  Store,
  Code2,
  Wand2,
  Users,
} from "lucide-react";

const yooAiFeatures = [
  {
    icon: Sparkles,
    title: "AI generates your app",
    description:
      "Describe what you want in plain text. AI assembles a multi-page app from the plugin marketplace in seconds.",
  },
  {
    icon: MousePointer2,
    title: "Edit directly in preview",
    description:
      "Click any block to edit inline — text, images, styles. No code editor. The preview is the editor.",
  },
  {
    icon: Layers,
    title: "Multi-page apps",
    description:
      "Unlimited pages with navigation, per-page SEO, and shared context. AI generates entire apps from one prompt.",
  },
  {
    icon: Code2,
    title: "API data binding",
    description:
      "Connect any block to external APIs. Product catalogs, listings, blog posts — static content meets live data.",
  },
  {
    icon: Wand2,
    title: "AI Plugin Generator",
    description:
      "Can't find the right block? Describe it. AI generates a complete plugin with live preview and source code.",
  },
  {
    icon: Store,
    title: "Plugin marketplace",
    description:
      "200+ plugins built by the community. Developers publish blocks, AI learns them, users install in one click.",
  },
  {
    icon: Users,
    title: "Real-time collaboration",
    description:
      "Edit together with cursors, selections, and presence. Powered by the same Yjs CRDT behind Figma and Notion.",
  },
];

export function Waitlist() {
  return (
    <section id="waitlist" className="relative py-16 sm:py-24">
      {/* Background */}
      <div className="absolute inset-0 glow-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent dark:via-violet-500/10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="info" className="mb-4 border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <Sparkles className="w-3 h-3 mr-1" />
            Built on Yoopta Editor
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
            See what people build with{" "}
            <span className="gradient-text">Yoopta</span>
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Yoo AI is an AI-powered app builder built on top of Yoopta Editor.
            Everything you love about Yoopta — plugins, drag & drop, theming — now
            wrapped in an AI-first experience anyone can use.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {yooAiFeatures.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm hover:border-violet-500/50 dark:hover:border-violet-500/50 transition-all duration-300"
            >
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 dark:from-violet-500/20 dark:to-fuchsia-500/20 group-hover:from-violet-500/20 group-hover:to-fuchsia-500/20 dark:group-hover:from-violet-500/30 dark:group-hover:to-fuchsia-500/30 transition-colors">
                <feature.icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-xl mx-auto">
          <div className="p-8 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 dark:from-violet-500/10 dark:to-fuchsia-500/10 shadow-xl shadow-violet-500/5">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">
                Try Yoo AI — free early access
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Describe your app. AI builds it with Yoopta plugins. You edit it visually.
                First 100 users get lifetime perks.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="gradient"
                size="lg"
                asChild
              >
                <a href="https://ai.yoopta.dev" target="_blank" rel="noopener noreferrer">
                  Try Yoo AI
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
              >
                <a href="https://ai.yoopta.dev" target="_blank" rel="noopener noreferrer">
                  Watch demo
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
