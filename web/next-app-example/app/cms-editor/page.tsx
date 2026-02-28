"use client";

import { useRef } from "react";
import { CMSEditor } from "./editor/editor";

export default function CMSPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-white">
      <CMSEditor containerBoxRef={containerRef} />
    </div>
  );
}
