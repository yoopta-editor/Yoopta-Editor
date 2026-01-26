"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Code, ExternalLink, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

// Example code snippets
const exampleCode: Record<string, string> = {
  basic: `import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { useMemo } from 'react';

const plugins = [Paragraph];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins }), []);

  return (
    <YooptaEditor
      editor={editor}
      placeholder="Start typing..."
      style={{ width: '100%' }}
    />
  );
}`,
  "with-toolbar": `import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { HeadingOne, HeadingTwo } from '@yoopta/headings';
import { Bold, Italic, Underline } from '@yoopta/marks';
import { YooptaToolbar } from '@yoopta/ui';
import { useMemo } from 'react';

const plugins = [Paragraph, HeadingOne, HeadingTwo];
const marks = [Bold, Italic, Underline];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks }), []);

  return (
    <YooptaEditor editor={editor} placeholder="Select text to format...">
      <YooptaToolbar />
    </YooptaEditor>
  );
}`,
  "full-setup": `import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
import { BulletedList, NumberedList, TodoList } from '@yoopta/lists';
import Blockquote from '@yoopta/blockquote';
import Code from '@yoopta/code';
import { Bold, Italic, Underline, Strike, CodeMark } from '@yoopta/marks';
import {
  YooptaToolbar,
  YooptaActionMenuList,
  YooptaFloatingBlockActions,
  YooptaSlashCommandMenu
} from '@yoopta/ui';
import { useMemo } from 'react';

const plugins = [
  Paragraph,
  HeadingOne, HeadingTwo, HeadingThree,
  BulletedList, NumberedList, TodoList,
  Blockquote,
  Code,
];

const marks = [Bold, Italic, Underline, Strike, CodeMark];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks }), []);

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
  headings: `import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
import { useMemo } from 'react';

const plugins = [Paragraph, HeadingOne, HeadingTwo, HeadingThree];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins }), []);

  return (
    <YooptaEditor
      editor={editor}
      placeholder="Type # for H1, ## for H2, ### for H3"
    />
  );
}`,
  lists: `import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { BulletedList, NumberedList, TodoList } from '@yoopta/lists';
import { useMemo } from 'react';

const plugins = [Paragraph, BulletedList, NumberedList, TodoList];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins }), []);

  return (
    <YooptaEditor
      editor={editor}
      placeholder="Type - for bullet, 1. for numbered, [] for todo"
    />
  );
}`,
  code: `import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import Code from '@yoopta/code';
import { useMemo } from 'react';

const plugins = [
  Paragraph,
  Code.extend({
    options: {
      theme: 'github-dark',
    },
  }),
];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins }), []);

  return (
    <YooptaEditor
      editor={editor}
      placeholder="Type \`\`\` to create a code block"
    />
  );
}`,
  tables: `import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import Table from '@yoopta/table';
import { useMemo } from 'react';

const plugins = [Paragraph, Table];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins }), []);

  return (
    <YooptaEditor
      editor={editor}
      placeholder="Type /table to insert a table"
    />
  );
}`,
  export: `import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import { html, markdown, plainText } from '@yoopta/exports';
import Paragraph from '@yoopta/paragraph';
import { useMemo } from 'react';

const plugins = [Paragraph];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins }), []);

  const handleExport = (format: 'html' | 'markdown' | 'text') => {
    const value = editor.getEditorValue();

    switch (format) {
      case 'html':
        return html.serialize(editor, value);
      case 'markdown':
        return markdown.serialize(editor, value);
      case 'text':
        return plainText.serialize(editor, value);
    }
  };

  return (
    <div>
      <YooptaEditor editor={editor} />
      <div className="flex gap-2 mt-4">
        <button onClick={() => console.log(handleExport('html'))}>
          Export HTML
        </button>
        <button onClick={() => console.log(handleExport('markdown'))}>
          Export Markdown
        </button>
      </div>
    </div>
  );
}`,
  "read-only": `import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { useMemo } from 'react';

const plugins = [Paragraph];

const initialValue = {
  'block-1': {
    id: 'block-1',
    type: 'Paragraph',
    value: [{
      id: 'element-1',
      type: 'paragraph',
      children: [{ text: 'This content is read-only.' }],
    }],
    meta: { order: 0, depth: 0 },
  },
};

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({
    plugins,
    value: initialValue,
  }), []);

  return (
    <YooptaEditor
      editor={editor}
      readOnly
    />
  );
}`,
};

interface ExampleViewerProps {
  slug: string;
  name: string;
  description?: string;
}

export function ExampleViewer({ slug, name, description }: ExampleViewerProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const code = exampleCode[slug] || "// Example code coming soon...";

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

          {mounted && (
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
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Preview */}
        <div
          className={`flex-1 p-6 overflow-auto bg-white dark:bg-neutral-900 ${showCode ? "w-1/2" : "w-full"}`}
        >
          <div className="max-w-3xl mx-auto">
            {/* Placeholder for actual editor - will be implemented with real Yoopta */}
            <div className="min-h-[400px] p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
              <div className="flex items-center justify-center h-full text-neutral-500 dark:text-neutral-400">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <p className="font-medium mb-1">Editor Preview</p>
                  <p className="text-sm">
                    Interactive editor will be rendered here
                  </p>
                  <p className="text-xs mt-2 text-neutral-400">
                    Install @yoopta/editor to see the live demo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Panel */}
        {showCode && (
          <div className="w-1/2 border-l border-neutral-200 dark:border-neutral-800 bg-[#0d1117] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              <span className="text-sm font-medium text-neutral-400">
                Example Code
              </span>
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
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm font-mono leading-relaxed">
                <code className="text-neutral-300">
                  {code.split("\n").map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-8 text-neutral-600 select-none text-right pr-4">
                        {i + 1}
                      </span>
                      <span>{line}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
