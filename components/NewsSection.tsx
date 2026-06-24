"use client";
import { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  score: string | null;
}

export function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/news_data.json");
        if (!res.ok) throw new Error("No news file");
        const data = await res.json();
        setNews(data.news || []);
      } catch {
        // Silent fail - news is optional
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="mb-8" dir="rtl">
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-slate-700 rounded w-1/3"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!news.length) return null;

  const scores = news.filter((n) => n.score).slice(0, 6);
  const headlines = news.filter((n) => !n.score).slice(0, 5);

  return (
    <section className="mb-8" dir="rtl">
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-amber-500/20 overflow-hidden backdrop-blur-sm">

        {/* Header */}
        <div className="bg-gradient-to-l from-amber-600/20 to-transparent px-6 py-4 border-b border-slate-700/50 flex items-center gap-3">
          <span className="text-2xl">📰</span>
          <h2 className="text-xl font-bold text-amber-400">آخر أخبار كأس العالم</h2>
          <span className="mr-auto text-xs text-slate-400">
            {new Date().toLocaleDateString("ar-MR")}
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Scores Section */}
          {scores.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <span>⚽</span> نتائج المباريات
              </h3>
              <div className="space-y-2">
                {scores.map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl hover:bg-slate-700/50 transition-all group"
                  >
                    <span className="text-emerald-400 text-lg">⚽</span>
                    <span className="text-amber-300 font-bold text-sm">{item.score}</span>
                    <span className="text-slate-300 text-xs group-hover:text-amber-400 transition-colors truncate">
                      {item.title.replace(/[^-–\d\s]/g, "").trim()}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Headlines Section */}
          {headlines.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <span>🌐</span> أخبار عاجلة
              </h3>
              <div className="space-y-2">
                {headlines.map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-xl hover:bg-slate-700/50 transition-all group"
                  >
                    <span className="text-blue-400 mt-0.5">📰</span>
                    <span className="text-slate-300 text-sm leading-relaxed group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 text-center">
          <a
            href="https://www.bbc.com/sport/football"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-amber-400 transition-colors"
          >
            المصدر: BBC Sport | يتم التحديث تلقائياً
          </a>
        </div>
      </div>
    </section>
  );
}
