"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Github, Moon, Sun, Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Features", href: "#features" },
  { name: "Plugins", href: "#plugins" },
  { name: "Roadmap", href: "#waitlist" },
  { name: "Docs", href: "https://docs.yoopta.dev" },
  { name: "Playground", href: "/playground" },
];

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="font-semibold text-lg text-neutral-900 dark:text-white">Yoopta</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
              >
                {item.name}
              </Link>
            ))}
          </div>


          {/* support project button */}

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-neutral-600 dark:text-neutral-400">
              <a href="https://github.com/sponsors/Darginec05" target="_blank" rel="noopener noreferrer">
                <Heart className="h-4 w-4" fill="#ec34a4" stroke="#ec34a4" />
              </a>
            </Button>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="h-8 w-8 text-neutral-600 dark:text-neutral-400"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-neutral-600 dark:text-neutral-400">
              <a
                href="https://github.com/Darginec05/Yoopta-Editor"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>

            <Button variant="primary" size="sm" asChild className="hidden sm:inline-flex h-8 w-24">
              <Link href="#get-started">Get Started</Link>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button variant="primary" size="sm" asChild className="mt-2">
                <Link href="#get-started">Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
