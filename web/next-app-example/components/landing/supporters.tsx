"use client";

import { Button } from "@/components/ui/button";
import { Heart, Github, Coffee } from "lucide-react";

type SponsorTier = "50" | "100-500" | "500-1000" | "1000";

interface Sponsor {
  name: string;
  logo: string;
  url: string;
  tier: SponsorTier;
}

const SPONSOR_TIER_CLASSES: Record<SponsorTier, string> = {
  "50": "h-8 w-auto",
  "100-500": "h-14 w-auto",
  "500-1000": "h-20 w-auto",
  "1000": "h-26 w-auto",
};

const SPONSORS: Sponsor[] = [
  {
    name: "Tapflow",
    logo: "/sponsor-logos/tapflow.png",
    url: "https://www.tapflow.ai/",
    tier: "1000",
  },
  {
    name: "Altrina",
    logo: "/sponsor-logos/altrina.png",
    url: "https://www.altrina.com/",
    tier: "100-500",
  },
];

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export function Supporters() {
  return (
    <section id="supporters" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            Supported by the community
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Yoopta is free and open-source, made possible by our sponsors and contributors.
          </p>
        </header>

        {/* 1. Open source sponsors */}
        {SPONSORS.length > 0 && (
          <div className="mb-14">
            <h3 className="text-center text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              <span className="inline-flex items-center gap-2">
                Current sponsors
                <Heart className="w-4 h-4 text-pink-500" />
              </span>
            </h3>
            <p className="text-center text-neutral-600 dark:text-neutral-400 text-sm mb-8 max-w-xl mx-auto">
              Thanks to these sponsors for supporting Yoopta.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-12">
              {SPONSORS.map((sponsor) => (
                <a
                  key={sponsor.name}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity rounded-lg p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                  title={sponsor.name}
                  style={{ backgroundColor: sponsor.name === 'Tapflow' ? '#0e0e0e' : undefined }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className={SPONSOR_TIER_CLASSES[sponsor.tier]}
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 2. Become a sponsor */}
        <div className="mb-14">
          <h3 className="text-center text-lg font-semibold text-neutral-900 dark:text-white mb-6">
            Become a sponsor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <a
              href="https://github.com/sponsors/Darginec05"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-pink-500/50 dark:hover:border-pink-500/50 transition-all duration-300"
            >
              <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-500/10 dark:bg-pink-500/20 group-hover:bg-pink-500/15 dark:group-hover:bg-pink-500/25 transition-colors">
                <Heart className="w-7 h-7 text-pink-500" />
              </div>
              <h4 className="text-base font-semibold mb-1.5 text-neutral-900 dark:text-white">
                GitHub Sponsors
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-4">
                Monthly support
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 dark:text-pink-400 group-hover:gap-3 transition-all">
                Become a sponsor
                <ArrowIcon />
              </span>
            </a>
            <a
              href="https://www.buymeacoffee.com/darginec05"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-300"
            >
              <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 group-hover:bg-amber-500/15 dark:group-hover:bg-amber-500/25 transition-colors">
                <Coffee className="w-7 h-7 text-amber-500" />
              </div>
              <h4 className="text-base font-semibold mb-1.5 text-neutral-900 dark:text-white">
                Buy Me a Coffee
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-4">
                One-time donation to show your appreciation
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:gap-3 transition-all">
                Support the project
                <ArrowIcon />
              </span>
            </a>
          </div>
        </div>

        {/* 3. Contributors */}
        <div className="mb-14">
          <h3 className="text-center text-lg font-semibold text-neutral-900 dark:text-white mb-6">
            Our contributors
            <span className="ml-1.5" aria-hidden>👏</span>
          </h3>
          <a
            href="https://github.com/Darginec05/Yoopta-Editor/graphs/contributors"
            target="_blank"
            rel="noopener noreferrer"
            className="block mx-auto w-fit rounded-xl overflow-hidden border-none border-neutral-200 dark:border-neutral-800 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
          >
            <img
              src="https://contrib.rocks/image?repo=Darginec05/Yoopta-Editor"
              alt="Contributors to Yoopta Editor"
              className="block"
            />
          </a>
          <p className="mt-5 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Want to contribute?{" "}
            <a
              href="https://github.com/Darginec05/Yoopta-Editor/blob/master/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Read the contributing guide
            </a>
          </p>
        </div>

        {/* 4. Star CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-5 sm:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
            <span className="text-2xl" aria-hidden>
              ⭐
            </span>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">
              If you find Yoopta useful, give us a star on GitHub
            </p>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com/Darginec05/Yoopta-Editor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section >
  );
}
