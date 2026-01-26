"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Github, Coffee } from "lucide-react";

export function Supporters() {
  return (
    <section id="supporters" className="relative py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
            Supported by the community
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Yoopta is free and open-source, made possible by our amazing
            sponsors and contributors.
          </p>
        </div>

        {/* Support options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          {/* GitHub Sponsors */}
          <a
            href="https://github.com/sponsors/Darginec05"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-pink-500/50 dark:hover:border-pink-500/50 transition-all duration-300"
          >
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/10 to-red-500/10 dark:from-pink-500/20 dark:to-red-500/20 group-hover:from-pink-500/20 group-hover:to-red-500/20 dark:group-hover:from-pink-500/30 dark:group-hover:to-red-500/30 transition-colors">
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">Sponsor on GitHub</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-4">
              Support ongoing development and get your name in the README
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 dark:text-pink-400 group-hover:gap-3 transition-all">
              Become a sponsor
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </a>

          {/* Buy Me a Coffee */}
          <a
            href="https://www.buymeacoffee.com/darginec05"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-300"
          >
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 group-hover:from-amber-500/20 group-hover:to-orange-500/20 dark:group-hover:from-amber-500/30 dark:group-hover:to-orange-500/30 transition-colors">
              <Coffee className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">Buy Me a Coffee</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-4">
              A one-time donation to show your appreciation
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:gap-3 transition-all">
              Support the project
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </a>
        </div>

        {/* Contributors */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-white">Our Contributors</h3>
          <a
            href="https://github.com/Darginec05/Yoopta-Editor/graphs/contributors"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:opacity-90 transition-opacity"
          >
            <img
              src="https://contrib.rocks/image?repo=Darginec05/Yoopta-Editor"
              alt="Contributors"
              className="mx-auto rounded-xl"
            />
          </a>
          <p className="mt-6 text-neutral-600 dark:text-neutral-400">
            Want to contribute?{" "}
            <a
              href="https://github.com/Darginec05/Yoopta-Editor/blob/master/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Read our contributing guide
            </a>
          </p>
        </div>

        {/* Star CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
            <div className="flex items-center gap-3">
              <Github className="w-6 h-6 text-neutral-900 dark:text-white" />
              <span className="text-neutral-600 dark:text-neutral-400">
                If you find Yoopta useful, give us a star!
              </span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com/Darginec05/Yoopta-Editor"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-4 h-4 mr-1 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
