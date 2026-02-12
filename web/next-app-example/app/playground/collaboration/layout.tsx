import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collaborative Editing",
  description:
    "Real-time collaborative editing with Yoopta Editor. See remote cursors, live sync, and multi-user presence powered by Yjs.",
  openGraph: {
    title: "Collaborative Editing | Yoopta Editor",
    description:
      "Real-time collaborative editing with cursors, presence, and live sync.",
  },
  twitter: {
    title: "Collaborative Editing | Yoopta Editor",
    description: "Real-time collaborative editing demo. Try it live.",
  },
};

export default function CollaborationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
