"use client";

import { useMemo, useRef } from "react";
import { generateId } from "@yoopta/editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Github,
  ExternalLink,
  Code2,
  Cloud,
} from "lucide-react";
import { CollaborationEditor } from "./collaboration-editor";
import { faker } from "@faker-js/faker";

export const CollaborationPage = () => {
  const containerBoxRef = useRef<HTMLDivElement | null>(null);

  const user = useMemo(
    () => {
      const {
        person: { firstName, lastName },
        color: { rgb },
      } = faker;

      return {
        id: generateId(),
        name: `${firstName()} ${lastName()}`,
        color: rgb({ format: 'hex', includeAlpha: false }),
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-2 sm:pb-4">
        <div className="text-center max-w-3xl mx-auto mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent">
            Collaborative Editing
          </h1>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 my-4 mx-auto max-w-2xl rounded-xl border border-violet-200 dark:border-violet-900/50 bg-gradient-to-br from-violet-50/80 to-blue-50/80 dark:from-violet-950/30 dark:to-blue-950/30 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row! items-center gap-4">
            <div className="hidden sm:flex! items-center justify-center w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/40 shrink-0">
              <Cloud className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">
                Interested in a Yoopta Cloud solution?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Managed collaboration infrastructure, real-time sync, and hosted backends — so you don&apos;t have to run your own servers.
              </p>
            </div>
            <Button asChild variant="default" size="sm" className="shrink-0 w-auto sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
              <a
                href="https://cal.eu/akhmed-ibragimov-ngggdf/30min"
                target="_blank"
                rel="noopener noreferrer"
              >
                Let&apos;s Talk
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Cloud CTA */}


      {/* Editor Card */}
      <section
        className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8"
        ref={containerBoxRef}
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 dark:from-blue-500/10 dark:via-transparent dark:to-violet-500/10 rounded-3xl blur-3xl" />

            <div className="relative rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl shadow-neutral-200/50 dark:shadow-neutral-900/50 overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 hidden sm:!inline">
                    collaboration.tsx
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <div
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm"
                    title="Your identity in this session"
                  >
                    <div
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-muted-foreground">
                      <span className="hidden sm:!inline">You are </span>
                      <span className="font-medium text-foreground">
                        {user.name}
                      </span>
                    </span>
                  </div>
                  <Badge variant="outline" className="hidden sm:!inline-flex">
                    <a
                      href="https://docs.yoopta.dev/core/collaboration"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Code2 className="w-3 h-3 mr-1" />
                      Documentation
                    </a>
                  </Badge>
                  <Badge variant="outline" className="hidden sm:!inline-flex">
                    <a
                      href="https://github.com/Darginec05/Yoopta-Editor/tree/main/web/next-app-example/components/playground/examples/collaboration"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Source Code
                    </a>
                  </Badge>
                  <Badge variant="outline" className="hidden sm:!inline-flex">
                    <a
                      href="https://github.com/Darginec05/Yoopta-Editor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Github className="w-3 h-3 mr-1" />
                      Star Repository
                    </a>
                  </Badge>
                </div>
              </div>

              {/* Editor body */}
              <div className="relative min-h-[400px] sm:min-h-[600px] max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-200px)] overflow-auto bg-white dark:bg-neutral-900">
                <div className="pt-0 pb-6 sm:pb-8 px-3 sm:px-8 lg:px-12">
                  <CollaborationEditor
                    user={user}
                    containerBoxRef={
                      containerBoxRef as React.RefObject<HTMLDivElement>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Add real-time collaboration to your editor in minutes.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button asChild>
                <a
                  href="https://docs.yoopta.dev/core/collaboration"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  View Documentation
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
