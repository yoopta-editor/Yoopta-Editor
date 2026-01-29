"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, ExternalLink } from "lucide-react";
import { useState } from "react";
import { FullSetupEditor } from "./examples/full-setup/editor";

interface ExampleViewerProps {
  name: string;
  description?: string;
}

export function ExampleViewer({ name, description }: ExampleViewerProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between h-16 px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">{name}</h1>
          {description && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {description}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCode(!showCode)}
          >
            <Code className="w-4 h-4 mr-2" />
            {showCode ? "Hide Code" : "View Code"}
          </Button>

          <Button variant="outline" size="sm" asChild>
            <a
              href={`https://github.com/Darginec05/Yoopta-Editor/tree/master/packages/development/src/pages/examples`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Source
            </a>
          </Button>

          {/* {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )} */}
        </div>
      </header>

      <div className="flex-1 flex justify-center overflow-hidden">
        <div
          className={`flex-1 py-6 px-0 overflow-auto dark:bg-neutral-900 max-w-4xl mx-auto`}
        >
          <FullSetupEditor />
        </div>
      </div>
    </div>
  );
}
