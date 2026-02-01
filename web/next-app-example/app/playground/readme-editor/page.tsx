"use client";

import { ReadmeEditor } from "@/components/playground/examples/readme-editor/readme-editor";
import { Header } from "@/components/landing/header";

export default function ReadmeEditorPage() {
  return (
    <div className="flex flex-col h-screen bg-neutral-50 dark:bg-neutral-950">
      <Header />
      <ReadmeEditor />
    </div>
  );
}
