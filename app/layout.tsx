import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://barbarabnartey-lgtm.github.io/";
const description =
  "Arden Vale portfolio — an immersive 3D exhibition of research, projects, skills, achievements, leadership, and the road ahead.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: "Arden Vale Portfolio",
      alternateName: "The Academic Dimension",
      description,
      inLanguage: "en",
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}#person`,
      name: "Arden Vale",
      url: siteUrl,
      jobTitle: "Computational neuroscientist & human–AI interaction designer",
      description,
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arden Vale Portfolio — The Academic Dimension",
    template: "%s — Arden Vale Portfolio",
  },
  description,
  applicationName: "Arden Vale Portfolio",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Arden Vale Portfolio — The Academic Dimension",
    description,
    type: "website",
    url: "/",
    siteName: "Arden Vale Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Arden Vale Portfolio — The Academic Dimension",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#03050b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
