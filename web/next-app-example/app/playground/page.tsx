import type { Metadata } from "next";
import { PlaygroundPage } from "@/components/playground/playground-page";

export const metadata: Metadata = {
  title: "Interactive Playground",
  description:
    "Try Yoopta Editor live with every plugin and mark. Slash menu, floating toolbar, block actions. See the headless React editor in action.",
};

export default function Page() {
  return <PlaygroundPage />;
}

