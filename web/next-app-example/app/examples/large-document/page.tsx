"use client";

import { useRef } from "react";
import { LargeDocumentEditor } from "@/components/playground/examples/large-document/editor";

export default function LargeDocumentPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="py-6 px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto" ref={containerRef}>
      <LargeDocumentEditor containerBoxRef={containerRef} />
    </div>
  );
}
