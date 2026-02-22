"use client";

import { useRef } from "react";
import { FullSetupEditor } from "@/components/playground/examples/full-setup/editor";
import { fullSetupInitialValue } from "./initial-value";

export default function FullSetupPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="py-6 px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto" ref={containerRef}>
      <FullSetupEditor initialValue={fullSetupInitialValue} containerBoxRef={containerRef} />
    </div>
  );
}
