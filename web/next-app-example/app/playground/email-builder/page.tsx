"use client";

import { EmailBuilder } from "@/components/playground/examples/email-builder/email-builder";
import { Header } from "@/components/landing/header";

export default function EmailBuilderPage() {
  return (
    <div className="flex flex-col h-screen bg-neutral-100 dark:bg-neutral-900">
      <Header />
      <EmailBuilder />
    </div>
  );
}
