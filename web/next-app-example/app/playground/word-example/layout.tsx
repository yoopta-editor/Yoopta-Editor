import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MS Word Example",
  description:
    "Microsoft Word-like rich text editor built with Yoopta Editor. Toolbar, formatting, lists, tables, images. Try the demo.",
  openGraph: {
    title: "MS Word Example | Yoopta Editor",
    description: "Word-like editor built with Yoopta. Toolbar, formatting, tables. Try the demo.",
  },
  twitter: {
    title: "MS Word Example | Yoopta Editor",
    description: "Word-like editor with Yoopta. Try the demo.",
  },
};

export default function WordExampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
