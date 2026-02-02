import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rich Chat",
  description:
    "Social media-like messaging interface built with Yoopta Editor. Rich text messages, code blocks, reactions, conversation list. See how to build social chat UIs with the headless editor.",
  openGraph: {
    title: "Rich Chat Example | Yoopta Editor",
    description: "Social messaging interface with Yoopta. Rich messages with code, formatting, and reactions.",
  },
  twitter: {
    title: "Rich Chat Example | Yoopta Editor",
    description: "Social chat UI with Yoopta Editor. Try the demo.",
  },
};

export default function RichChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
