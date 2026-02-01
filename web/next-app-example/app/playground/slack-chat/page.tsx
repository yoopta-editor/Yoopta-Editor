"use client";

import { SlackChatEditor } from "@/components/playground/examples/slack-chat/slack-chat-editor";
import { Header } from "@/components/landing/header";

export default function SlackChatPage() {
  return (
    <div className="flex flex-col h-screen bg-neutral-100 dark:bg-neutral-900">
      <Header />
      <SlackChatEditor />
    </div>
  );
}
