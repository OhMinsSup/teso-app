import type { Metadata, Viewport } from "next";
import { cn } from "@veloss/ui";
import { ThemeProvider } from "@veloss/ui/theme";
import { Toaster } from "@veloss/ui/toaster";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { headers } from "next/headers";

import { SITE_CONFIG } from "~/constants/constants";
import { getRequestInfo } from "~/utils/request";

export async function generateMetadata(): Promise<Metadata> {
  const info = getRequestInfo(headers());
  const metadataBase = new URL(info.domainUrl);
  const manifestURL = new URL(SITE_CONFIG.manifest, metadataBase);

  return {
    title: "veloss - website",
    description: "veloss personal website",
    metadataBase,
    manifest: manifestURL,
    alternates: {
      canonical: metadataBase,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
