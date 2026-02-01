"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "basic",
    label: "Basic",
    code: `import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { HeadingOne, HeadingTwo } from '@yoopta/headings';
import { Bold, Italic, Underline } from '@yoopta/marks';
import { useMemo } from 'react';

const plugins = [Paragraph, HeadingOne, HeadingTwo];
const marks = [Bold, Italic, Underline];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({
    plugins,
    marks,
  }), []);

  return (
    <YooptaEditor
      editor={editor}
      placeholder="Start typing..."
      style={{ width: 750 }}
    />
  );
}`,
  },
  {
    id: "with-ui",
    label: "With UI",
    code: `import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import {
  YooptaToolbar,
  YooptaActionMenuList,
  YooptaFloatingBlockActions,
  YooptaSlashCommandMenu
} from '@yoopta/ui';

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({
    plugins: PLUGINS,
    marks: MARKS,
  }), []);

  return (
    <YooptaEditor
      editor={editor}
      autoFocus
      placeholder="Type / to open menu"
    >
      <YooptaToolbar />
      <YooptaSlashCommandMenu />
      <YooptaActionMenuList />
      <YooptaFloatingBlockActions />
    </YooptaEditor>
  );
}`,
  },
  {
    id: "api",
    label: "Editor API",
    code: `// Insert blocks programmatically
editor.insertBlock('Paragraph', {
  at: 0,
  focus: true,
});

// Build complex elements with editor.y()
const elements = editor.y('paragraph', {
  children: [
    editor.y.text('Hello '),
    editor.y.text('World', { bold: true }),
  ],
});

// Toggle block types
editor.toggleBlock('HeadingOne');

// Export content
const html = editor.getHTML();
const markdown = editor.getMarkdown();

// Listen to changes
editor.on('change', (value) => {
  saveToDatabase(value);
});`,
  },
  {
    id: "export",
    label: "Export",
    code: `import { html, markdown, plainText } from '@yoopta/exports';

// Export to HTML
const htmlString = html.serialize(editor, editor.getEditorValue());

// Export to Markdown
const md = markdown.serialize(editor, editor.getEditorValue());

// Export to plain text
const text = plainText.serialize(editor, editor.getEditorValue());

// Import from HTML
const value = html.deserialize(editor, htmlString);

// Import from Markdown
const value = markdown.deserialize(editor, markdownString);`,
  },
];

export function CodeExample() {
  const [activeTab, setActiveTab] = React.useState("basic");
  const [copied, setCopied] = React.useState(false);

  const activeCode = tabs.find((t) => t.id === activeTab)?.code || "";

  const copyCode = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="get-started" className="relative py-12 sm:py-16">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get started in minutes
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Simple API, powerful features. Build your editor with just a few
            lines of code.
          </p>
        </div>

        {/* Code block */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-[#0d1117] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              {/* Tabs */}
              <div className="flex items-center gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                      activeTab === tab.id
                        ? "bg-neutral-800 text-white"
                        : "text-neutral-400 hover:text-neutral-200"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Copy button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCode}
                className="text-neutral-400 hover:text-white"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Code */}
            <div className="p-4 overflow-x-auto">
              <pre className="text-sm font-mono leading-relaxed">
                <code className="text-neutral-300">
                  {activeCode.split("\n").map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-8 text-neutral-600 select-none text-right pr-4">
                        {i + 1}
                      </span>
                      <span>
                        {highlightCode(line)}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>

          {/* Install steps */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Install",
                code: "npm install @yoopta/editor",
              },
              {
                step: "2",
                title: "Add plugins",
                code: "npm install @yoopta/paragraph @yoopta/headings",
              },
              {
                step: "3",
                title: "Import & use",
                code: "import YooptaEditor from '@yoopta/editor'",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                    {item.step}
                  </span>
                  <span className="font-medium">{item.title}</span>
                </div>
                <code className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  {item.code}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Simple syntax highlighting
function highlightCode(line: string): React.ReactNode {
  // Keywords
  const keywords = /\b(import|export|from|const|let|default|function|return|if|else)\b/g;
  // Strings
  const strings = /(['"`])((?:\\\1|(?:(?!\1)).)*?)\1/g;
  // Comments
  const comments = /(\/\/.*$)/g;
  // Functions/methods
  const functions = /\b([a-zA-Z_]\w*)\s*(?=\()/g;
  // JSX tags
  const jsxTags = /(<\/?[A-Z][a-zA-Z]*)/g;

  let result = line;

  // Apply highlighting with spans
  result = result
    .replace(comments, '<span class="text-neutral-500">$1</span>')
    .replace(strings, '<span class="text-emerald-400">$1$2$1</span>')
    .replace(keywords, '<span class="text-violet-400">$1</span>')
    .replace(jsxTags, '<span class="text-blue-400">$1</span>')
    .replace(/\{/g, '<span class="text-amber-400">{</span>')
    .replace(/\}/g, '<span class="text-amber-400">}</span>');

  return <span dangerouslySetInnerHTML={{ __html: result }} />;
}
