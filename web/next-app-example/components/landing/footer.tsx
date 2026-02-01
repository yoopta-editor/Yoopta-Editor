"use client";

import * as React from "react";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";

const navigation = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Plugins", href: "#plugins" },
    { name: "Roadmap", href: "#waitlist" },
    { name: "Playground", href: "/playground" },
  ],
  resources: [
    { name: "Documentation", href: "https://docs.yoopta.dev" },
    { name: "API Reference", href: "https://docs.yoopta.dev/core/editor" },
    { name: "Changelog", href: "https://github.com/Darginec05/Yoopta-Editor/releases" },
  ],
  community: [
    { name: "GitHub", href: "https://github.com/Darginec05/Yoopta-Editor" },
    { name: "Discord", href: "https://discord.gg/Dt8rhSTjsn" },
    { name: "Twitter", href: "https://twitter.com/LebovskiYoo" },
    { name: "Discussions", href: "https://github.com/Darginec05/Yoopta-Editor/discussions" },
  ],
  legal: [
    { name: "MIT License", href: "https://github.com/Darginec05/Yoopta-Editor/blob/master/LICENSE" },
    { name: "Contributing", href: "https://github.com/Darginec05/Yoopta-Editor/blob/master/CONTRIBUTING.md" },
    { name: "Code of Conduct", href: "https://github.com/Darginec05/Yoopta-Editor/blob/master/CODE_OF_CONDUCT.md" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="font-semibold text-lg text-neutral-900 dark:text-white">Yoopta Editor</span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs mb-4">
              Free, open-source rich-text editor. Build really rich
              editors with ease.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Darginec05/Yoopta-Editor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/LebovskiYoo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://discord.gg/Dt8rhSTjsn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-neutral-900 dark:text-white">Product</h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-neutral-900 dark:text-white">Resources</h3>
            <ul className="space-y-3">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-neutral-900 dark:text-white">Community</h3>
            <ul className="space-y-3">
              {navigation.community.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} Yoopta Editor. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {navigation.legal.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
