import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { LiveScoresTicker } from "@/components/LiveScoresTicker";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic" });

export const metadata: Metadata = {
  title: {
    default: "Mauribin | موريبين - أخبار كرة القدم بالعربية",
    template: "%s | Mauribin",
  },
  description: "Mauribin - موقعك لأخبار كرة القدم بالعربية. نتائج مباشرة، إصابات، انتقالات، ومباريات كأس العالم 2026.",
  keywords: ["كورة", "كرة قدم", "أخبار رياضية", "WC 2026", "الدوري", "انتقالات"],
  openGraph: {
    type: "website",
    locale: "ar",
    siteName: "Mauribin",
    title: "Mauribin | موريبين - أخبار كرة القدم بالعربية",
    description: "آخر أخبار كرة القدم بالعربية - نتائج مباشرة، تحليلات، انتقالات",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${arabic.variable}`}>
      <body className="font-arabic bg-slate-900 text-slate-100 antialiased min-h-screen flex flex-col">
        <Navigation />
        <LiveScoresTicker />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
