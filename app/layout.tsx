import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { LiveScoresTicker } from "@/components/LiveScoresTicker";
import { Footer } from "@/components/Footer";
import { BankilyAd } from "@/components/BankilyAd";
import { AdsterraSocialBar } from "@/components/AdsterraSocialBar";
import { GoogleAdSense, AdSlot } from "@/components/GoogleAdSense";
import { fetchScores } from "@/lib/data";
import { Analytics } from "@vercel/analytics/react";
import { PWAProvider, ScrollRestoration } from "@/components/PWAProvider";
import { I18nProvider } from "@/components/I18nProvider";
import { VideoAdOverlay } from "@/components/VideoAdOverlay";

// Layout fetches fresh data per request to keep the live ticker accurate
// (ticker still refreshes client-side every 30s via /api/live-scores)
export const dynamic = "force-dynamic";
export const revalidate = 0;

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic" });

export const metadata: Metadata = {
  title: {
    default: "Mauribin | موريبين - أخبار كرة القدم بالعربية",
    template: "%s | Mauribin",
  },
  description: "Mauribin - موقعك لأخبار كرة القدم بالعربية. نتائج مباشرة، إصابات، انتقالات، ومباريات كأس العالم 2026.",
  keywords: ["كورة", "كرة قدم", "أخبار رياضية", "WC 2026", "الدوري", "انتقالات"],
  applicationName: "Mauribin",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Mauribin",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "ar",
    siteName: "Mauribin",
    title: "Mauribin | موريبين - أخبار كرة القدم بالعربية",
    description: "آخر أخبار كرة القدم بالعربية - نتائج مباشرة، تحليلات، انتقالات",
  },
  twitter: { card: "summary_large_image" },
  other: {
    "theme-color": "#006233",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Mauribin",
    "format-detection": "telephone=no",
    "msapplication-TileColor": "#006233",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const scoresData = await fetchScores();
  const matches = scoresData.matches || [];

  return (
    <I18nProvider>
      <html lang="ar" dir="rtl" className={`${inter.variable} ${arabic.variable}`}>
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css" />
        </head>
        <body className="font-arabic bg-slate-900 text-slate-100 antialiased min-h-screen flex flex-col">
          <Analytics />
          <PWAProvider />
          <ScrollRestoration />
          <Navigation />
          <LiveScoresTicker initialMatches={matches} />
          <main className="flex-1">
            {children}
          </main>
          <BankilyAd variant="float" />
          <AdsterraSocialBar />
          <Footer />
          <VideoAdOverlay onComplete={() => {}} />
        </body>
      </html>
    </I18nProvider>
  );
}
