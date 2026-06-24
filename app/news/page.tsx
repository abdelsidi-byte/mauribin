"use client";
import { NewsSection } from "@/components/NewsSection";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a0d] to-[#000] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006233] to-[#004225] px-6 py-8 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black text-white mb-2">📰 آخر أخبار كأس العالم 2026</h1>
          <p className="text-[#FFD700] text-sm">تحديث تلقائي من BBC Sport + Google News</p>
        </div>
      </div>

      {/* News Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <NewsSection />
      </div>
    </div>
  );
}
