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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Yoopta Editor",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      description:
        "Free, open-source headless rich text editor for React. 20+ block plugins, drag & drop, themes, full API. Build Notion-like apps in minutes.",
      url: SITE_URL,
      image: `${SITE_URL}/og.png`,
      author: {
        "@type": "Organization",
        name: "Yoopta",
        url: "https://github.com/Darginec05/Yoopta-Editor",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        ratingCount: "100",
        bestRating: "5",
        worstRating: "1",
      },
      featureList: [
        "20+ Block Plugins",
        "Drag & Drop",
        "Keyboard Shortcuts",
        "Export to HTML/Markdown",
        "TypeScript Support",
        "Theme Support",
        "Mobile Friendly",
      ],
      softwareRequirements: "React 18+",
      programmingLanguage: "TypeScript",
      license: "https://opensource.org/licenses/MIT",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Yoopta",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og.png`,
      },
      sameAs: [
        "https://github.com/Darginec05/Yoopta-Editor",
        "https://twitter.com/LebovskiYoo",
        "https://discord.gg/Dt8rhSTjsn",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Yoopta Editor",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://docs.yoopta.dev/?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
