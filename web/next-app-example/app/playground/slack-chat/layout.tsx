import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slack Chat",
  description:
    "Slack-like messaging UI built with Yoopta Editor. Channel list, message composer, formatting. See how to build chat interfaces with the headless editor.",
  openGraph: {
    title: "Slack Chat Example | Yoopta Editor",
    description: "Slack-like chat UI with Yoopta. Channel list, composer, formatting.",
  },
  twitter: {
    title: "Slack Chat Example | Yoopta Editor",
    description: "Slack-like chat UI with Yoopta. Try the demo.",
  },
};

export default function SlackChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
