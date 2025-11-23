import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "StreetConnect - Find Nearby Services",
  description:
    "Find shelters, food, showers, medical care, and more near you. No account needed.",
  keywords: [
    "homeless services",
    "shelter",
    "food bank",
    "free meals",
    "social services",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StreetConnect",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="format-detection" content="telephone=yes" />
      </head>
      <body className="antialiased safe-area-top">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
