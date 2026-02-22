"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  Heart,
  Laptop,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavigation = [
  { name: "Examples", href: "/examples" },
  { name: "Documentation", href: "https://docs.yoopta.dev", external: true },
];


const MOBILE_BREAKPOINT_PX = 768;

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  // Avoid SSR/media-query flash: default to desktop, then sync with viewport in useLayoutEffect
  const [isMobile, setIsMobile] = React.useState(false);

  React.useLayoutEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`);
    const update = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT_PX);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const isActive = (href: string) => {
    if (href === "/playground") {
      return pathname === "/playground";
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          {/* change bg- to bg-primary after release */}
          <div className="flex h-7 w-7 items-end justify-center gap-0 bg-[#171717] rounded-md border border-white">
            <span className="text-md font-black text-white rotate-[-8deg] mb-px">Y</span>
            <span className="text-sm font-black text-white rotate-[12deg] mb-[3px] -ml-[3px]">o</span>
          </div>
          <span className="font-semibold text-foreground">Yoopta</span>
          <Badge variant="warning" className="ml-0.5 text-[10px] font-medium px-1.5 py-0">
            Beta
          </Badge>
        </Link>

        {/* Desktop Navigation — visibility by JS to avoid SSR/media-query flash */}
        <nav className={cn("items-center gap-1", isMobile ? "hidden" : "flex")}>
          {mainNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={cn(
                "inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive(item.href)
                  ? "bg-neutral-100 dark:bg-neutral-800 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              {item.name}
              {item.external && <ExternalLink className="h-3 w-3" />}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-2">
          {/* GitHub Stars Badge */}
          <a
            href="https://github.com/Darginec05/Yoopta-Editor/stargazers"
            target="_blank"
            rel="noopener noreferrer"
            className={cn("hidden", !isMobile && "sm:block")}
          >
            <img
              src="https://img.shields.io/github/stars/Darginec05/Yoopta-Editor?style=social"
              alt="GitHub stars"
              className="h-5"
            />
          </a>

          {/* npm Downloads Badge */}
          <a
            href="https://www.npmjs.com/package/@yoopta/editor"
            target="_blank"
            rel="noopener noreferrer"
            className={cn("hidden", !isMobile && "lg:block")}
          >
            <img
              src="https://img.shields.io/npm/dm/@yoopta/editor?label=downloads&color=blue"
              alt="npm downloads"
              className="h-5"
            />
          </a>

          <Separator orientation="vertical" className={cn("h-6", isMobile ? "hidden" : "sm:block")} />

          {/* Sponsor Link */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 text-muted-foreground hover:text-pink-500"
          >
            <a
              href="https://github.com/sponsors/Darginec05"
              target="_blank"
              rel="noopener noreferrer"
              title="Sponsor"
            >
              <Heart className="h-4 w-4" />
            </a>
          </Button>

          {/* GitHub Link */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 text-muted-foreground"
          >
            <a
              href="https://github.com/Darginec05/Yoopta-Editor"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </Button>

          {/* {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="h-8 w-8 text-muted-foreground"
              title={resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )} */}

          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", isMobile ? "" : "hidden")}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && isMobile && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <nav className="container px-4 py-4 space-y-1">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive(item.href)
                    ? "bg-neutral-100 dark:bg-neutral-800 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
              >
                {item.name === "Playground" ? (
                  <Laptop className="h-4 w-4" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
                {item.name}
                {item.external && <ExternalLink className="h-3 w-3 ml-auto" />}
              </Link>
            ))}

            <div className="pt-2">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Examples
              </p>
              {exampleNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                      isActive(item.href)
                        ? "bg-neutral-100 dark:bg-neutral-800 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {item.description}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
