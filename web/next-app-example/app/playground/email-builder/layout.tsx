import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Builder",
  description:
    "Email builder demo with Yoopta Editor. Rich content, blocks, and export. See how to build email composition UIs with the headless editor.",
  openGraph: {
    title: "Email Builder | Yoopta Editor",
    description: "Email builder with Yoopta. Rich content, blocks, export.",
  },
  twitter: {
    title: "Email Builder | Yoopta Editor",
    description: "Email builder with Yoopta. Try the demo.",
  },
};

export default function EmailBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
