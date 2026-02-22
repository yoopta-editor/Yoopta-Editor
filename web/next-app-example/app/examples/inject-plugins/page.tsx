"use client";

import { useRef } from "react";
import { InjectPluginsEditor } from "@/components/playground/examples/inject-plugins/editor";
import { injectPluginsInitialValue } from "./initial-value";

export default function InjectPluginsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="py-6 px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto" ref={containerRef}>
      <InjectPluginsEditor initialValue={injectPluginsInitialValue} containerBoxRef={containerRef} />
    </div>
  );
}
