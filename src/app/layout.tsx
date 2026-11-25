import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ManualProvider } from "@/components/ManualProvider";
import { AppShell } from "@/components/shell/AppShell";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "Interview field manual · Leapfrog", template: "%s · Leapfrog interview manual" },
  description: "Two-hour, eight-stage interview preparation manual for the AI Integration Engineer role.",
  robots: { index: false, follow: false },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23185c4f'/><text x='16' y='22' font-size='16' text-anchor='middle' fill='white' font-family='Georgia'>L</text></svg>",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

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
