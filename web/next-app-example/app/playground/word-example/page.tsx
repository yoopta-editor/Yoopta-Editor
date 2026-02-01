"use client";

import { WordEditor } from "@/components/playground/examples/word-example/word-editor";
import { Header } from "@/components/landing/header";

export default function WordExamplePage() {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <Header />
      <WordEditor />
    </div>
  );
}
