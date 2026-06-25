"use client";
import { NewsSection } from "@/components/NewsSection";
import { useI18n } from "@/components/I18nProvider";

export default function NewsPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a0d] to-[#000] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006233] to-[#004225] px-6 py-8 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black text-white mb-2">📰 {t("news.title")}</h1>
          <p className="text-[#FFD700] text-sm">{t("news.subtitle")}</p>
        </div>
      </div>

      {/* News Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <NewsSection />
      </div>
    </div>
  );
}
