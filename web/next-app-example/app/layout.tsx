import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.yoopta.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yoopta Editor | Headless Rich Text Editor for React",
    template: "%s | Yoopta Editor",
  },
  description:
    "Free, open-source headless rich text editor for React. 20+ block plugins, drag & drop, themes, full API. Build Notion-like apps in minutes. Try the playground.",
  keywords: [
    "rich text editor",
    "react editor",
    "headless editor",
    "notion clone",
    "slate.js",
    "wysiwyg editor",
    "block editor",
    "yoopta",
    "open source",
    "react wysiwyg",
    "contenteditable",
    "document editor",
  ],
  authors: [{ name: "Yoopta", url: "https://github.com/Darginec05/Yoopta-Editor" }],
  creator: "Yoopta",
  publisher: "Yoopta",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Yoopta Editor",
    title: "Yoopta Editor | Headless Rich Text Editor for React",
    description:
      "Free, open-source headless rich text editor for React. 20+ block plugins, drag & drop, themes. Build Notion-like apps in minutes.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Yoopta Editor - Rich text editor for React",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoopta Editor | Headless Rich Text Editor for React",
    description:
      "Free, open-source headless rich text editor for React. 20+ block plugins, drag & drop, full API. Build in minutes.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "technology",
  applicationName: "Yoopta Editor",
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
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
        </ThemeProvider> */}
        {children}
      </body>
    </html>
  );
}
