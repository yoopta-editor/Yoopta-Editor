"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is Yoopta Editor free to use?",
    answer:
      "Yes! Yoopta Editor is completely free and open-source under the MIT license. You can use it in personal and commercial projects without any restrictions. The core library and all 18+ plugins are free forever.",
  },
  {
    question: "Can I use Yoopta Editor in commercial projects?",
    answer:
      "Absolutely. The MIT license allows you to use Yoopta Editor in any commercial application. You can modify, distribute, and sell products built with it. No attribution required, though we'd appreciate a mention!",
  },
  {
    question: "How does Yoopta compare to other editors like TipTap, Lexical, or Quill?",
    answer:
      "Yoopta is built specifically for React with a focus on the Notion-style block editing experience. Unlike Quill (which uses its own data model) or Lexical (Meta's editor), Yoopta is built on Slate.js which provides a familiar React-like experience. We offer more out-of-the-box plugins than most alternatives, including tables, accordions, and tabs.",
  },
  {
    question: "Is Yoopta Editor production-ready?",
    answer:
      "Yes, Yoopta Editor is used in production by multiple companies. We maintain comprehensive tests and follow semantic versioning. The v6 release brings significant stability improvements and a refined API.",
  },
  {
    question: "Does Yoopta support TypeScript?",
    answer:
      "Yes! Yoopta Editor is written in TypeScript and provides full type definitions for all packages. You'll get complete IntelliSense support and type safety when building your editor.",
  },
  {
    question: "Can I create custom plugins?",
    answer:
      "Absolutely. Yoopta has a powerful plugin API that lets you create custom block types with custom renders, shortcuts, and behaviors. You can also extend existing plugins or create inline elements like custom mentions.",
  },
  {
    question: "Does Yoopta support real-time collaboration?",
    answer:
      "Real-time collaboration is coming in our Pro plan. The core library supports the data structures needed for collaboration, and we're building first-class support for providers like Yjs and Liveblocks.",
  },
  {
    question: "How do I export content to HTML or Markdown?",
    answer:
      "Yoopta includes the @yoopta/exports package with built-in serializers for HTML, Markdown, plain text, and email-compatible HTML. You can also create custom serializers for your specific format needs.",
  },
  {
    question: "What browsers are supported?",
    answer:
      "Yoopta Editor supports all modern browsers including Chrome, Firefox, Safari, and Edge. It also works on mobile browsers with touch-optimized interactions.",
  },
  {
    question: "How do I get support?",
    answer:
      "For community support, join our Discord server or open an issue on GitHub. We actively monitor both channels and typically respond within 24-48 hours. Pro and Enterprise plans include priority support with faster response times.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-900/50" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
            Frequently asked questions
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Everything you need to know about Yoopta Editor
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions */}
        <div className="mt-12 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 text-center">
          <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">Still have questions?</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Can't find the answer you're looking for? Join our community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://discord.gg/Dt8rhSTjsn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Join Discord
            </a>
            <a
              href="https://github.com/Darginec05/Yoopta-Editor/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub Discussions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
