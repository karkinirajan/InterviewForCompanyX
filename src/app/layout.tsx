import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ManualProvider } from "@/components/ManualProvider";
import { AppShell } from "@/components/shell/AppShell";
import "@fontsource-variable/literata";
import "@fontsource-variable/literata/wght-italic.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/400-italic.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@/styles/globals.css";

/** Absolute base for Open Graph URLs: SITE_URL if set, else Vercel's production domain, else local. */
const SITE_URL = process.env.SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const DESCRIPTION = "A reference handbook and interview route for full-stack engineers moving into applied AI: backend, frontend, cloud, LLMs, RAG, agents and production AI, with key points, questions and two projects per lesson.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Engineering field guide: full-stack to applied AI", template: "%s · Engineering field guide" },
  description: DESCRIPTION,
  applicationName: "Engineering field guide",
  robots: { index: false, follow: false },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Engineering field guide",
    title: "Engineering field guide: full-stack to applied AI",
    description: DESCRIPTION,
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "Engineering field guide: a hill of five strata with a lit summit" }],
  },
  twitter: { card: "summary_large_image", images: ["/brand/og.png"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef0ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1519" },
  ],
};

// Runs before paint so the saved theme never flashes.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("lf-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <ManualProvider>
          <AppShell>{children}</AppShell>
        </ManualProvider>
      </body>
    </html>
  );
}
