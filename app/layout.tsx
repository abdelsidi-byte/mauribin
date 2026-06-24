import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { LiveScoresTicker } from "@/components/LiveScoresTicker";
import { Footer } from "@/components/Footer";
import { BankilyAd } from "@/components/BankilyAd";
import { GoogleAdSense, AdSlot } from "@/components/GoogleAdSense";
import { fetchScores } from "@/lib/data";
import { Analytics } from "@vercel/analytics/react";
import { PWAProvider } from "@/components/PWAProvider";

// ISR enabled - cache for 30 seconds, regenerate in background
export const dynamic = "force-static";
export const revalidate = 30;

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
    <html lang="ar" dir="rtl" className={`${inter.variable} ${arabic.variable}`}>
      <body className="font-arabic bg-slate-900 text-slate-100 antialiased min-h-screen flex flex-col">
        <Analytics />
        <PWAProvider />
        <Navigation />
        <LiveScoresTicker initialMatches={matches} />
        <main className="flex-1">
          {children}
        </main>
        <BankilyAd variant="float" />
        <Footer />
      </body>
    </html>
  );
}
