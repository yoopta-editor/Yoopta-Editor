import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "README Editor",
  description:
    "GitHub README editor with live Markdown preview. Built with Yoopta Editor. Edit and preview in split view — perfect for docs and README files.",
  openGraph: {
    title: "README Editor | Yoopta Editor",
    description: "README editor with live Markdown preview. Split view, Yoopta blocks.",
  },
  twitter: {
    title: "README Editor | Yoopta Editor",
    description: "README editor with live preview. Try the demo.",
  },
};

export default function ReadmeEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
