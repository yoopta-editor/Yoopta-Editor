import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Try Yoopta Editor live in the browser. All plugins, marks, and UI components. No signup — experiment with the headless rich text editor for React.",
  openGraph: {
    title: "Playground | Yoopta Editor",
    description:
      "Try Yoopta Editor live. All plugins, marks, UI. Experiment with the headless rich text editor for React.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Playground | Yoopta Editor",
    description: "Try Yoopta Editor live. All plugins and UI. No signup.",
  },
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
