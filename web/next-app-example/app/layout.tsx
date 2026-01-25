import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yoopta Editor - Build Notion-like editors in React",
  description:
    "Free, open-source rich-text editor for React. 18+ plugins, drag & drop, keyboard shortcuts, and more. Built on Slate.js with a powerful plugin architecture.",
  keywords: [
    "rich text editor",
    "react editor",
    "notion clone",
    "slate.js",
    "wysiwyg editor",
    "block editor",
    "yoopta",
    "open source",
  ],
  authors: [{ name: "Yoopta" }],
  openGraph: {
    title: "Yoopta Editor - Build Notion-like editors in React",
    description:
      "Free, open-source rich-text editor for React. 18+ plugins, drag & drop, keyboard shortcuts, and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoopta Editor - Build Notion-like editors in React",
    description:
      "Free, open-source rich-text editor for React. 18+ plugins, drag & drop, keyboard shortcuts, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
