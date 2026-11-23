import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Academic Dimension — Arden Vale",
  description:
    "An immersive 3D exhibition of an academic journey: research, projects, skills, achievements, leadership, and the road ahead.",
  applicationName: "The Academic Dimension",
  openGraph: {
    title: "The Academic Dimension — Arden Vale",
    description:
      "An immersive 3D exhibition of an academic journey: research, projects, skills, achievements, leadership, and the road ahead.",
    type: "website",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
