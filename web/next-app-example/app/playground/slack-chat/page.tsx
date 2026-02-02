"use client";

import { SlackChatEditor } from "@/components/playground/examples/slack-chat/slack-chat-editor";
import { Header } from "@/components/landing/header";
import Link from "next/link";
import { Code2 } from "lucide-react";

const SOURCE_URL =
  "https://github.com/Darginec05/Yoopta-Editor/tree/main/web/next-app-example/components/playground/examples/slack-chat";

export default function SlackChatPage() {
  return (
    <div className="flex flex-col h-screen bg-neutral-100 dark:bg-neutral-900">
      <Header />
      <div className="flex justify-end px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0">
        <Link
          href={SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          <Code2 className="w-4 h-4" />
          View source
        </Link>
      </div>
      <SlackChatEditor />
    </div>
  );
}
