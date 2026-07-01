"use client";

import { useMemo, useState, useDeferredValue } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { search, type SearchResult } from "@/lib/search";
import { TEAMS, GROUPS } from "@/lib/worldcup-data";

// ─── Highlight Helper ─────────────────────────────────────────────────────────
function highlight(text: string, query: string) {
  if (!query.trim() || !text) return text;
  const trimmed = query.trim();
  // Escape regex special chars; case-insensitive substring highlight
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Use non-global regex.test() to avoid lastIndex state pollution
  const testRegex = new RegExp(escaped, "i");
  if (!testRegex.test(text)) return text;
  // Now use split with global regex (alternating non-match/match groups)
  const splitRegex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(splitRegex);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-[#ffd700]/30 text-[#ffd700] rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [activeTab, setActiveTab] = useState<"all" | "team" | "match" | "group" | "venue">("all");

  // Run search (memoized for performance)
  const searchResults = useMemo(() => {
    if (!deferredQuery.trim()) {
      return { query: "", total: 0, results: { teams: [], groups: [], matches: [], venues: [] }, all: [] };
    }
    return search(deferredQuery, 60);
  }, [deferredQuery]);

  const hasQuery = deferredQuery.trim().length > 0;
  const filtered = activeTab === "all"
    ? searchResults.all
    : searchResults.all.filter(r => r.type === activeTab || (activeTab === "team" && r.type === "team"));

  const suggestions = [
    "البرازيل",
    "فرنسا",
    "المغرب",
    "مصر",
    "المجموعة A",
    "النهائي",
    "Germany",
    "Brazil",
  ];

  // Map SearchResult type → Arabic label
  const typeLabels: Record<string, string> = {
    team: "منتخب",
    match: "مباراة",
    group: "مجموعة",
    venue: "ملعب",
  };

  return (
    <div className="min-h-screen pb-16 relative">
      {/* Background flourishes */}
      <div className="absolute inset-0 pitch-stripes opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-64 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-96 h-64 bg-[#006233]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#006233]/80 via-[#006233]/60 to-[#006233]/80" />
        <div className="absolute top-0 left-1/4 w-96 h-64 bg-[#ffd700]/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-64 bg-[#ffd700]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/30" />

        <div className="container mx-auto px-4 py-10 md:py-14 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30">
              <span className="text-2xl">🔎</span>
              <span className="text-[#ffd700] font-bold">البحث في موريبين</span>
              <span className="text-2xl">🔎</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              ابحث عن منتخباتك ومبارياتك
            </h1>
            <p className="text-[#f1f5f9]/80 mb-8">
              ابحث بالعربية أو الإنجليزية، أو بحرف المجموعة، أو باسم الملعب، أو بمرحلة البطولة.
            </p>

            <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />

            {/* Stats / hint row */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
              {hasQuery ? (
                <>
                  <span className="px-3 py-1.5 rounded-full bg-[#006233]/40 border border-[#ffd700]/30 text-[#ffd700] font-semibold">
                    {searchResults.total} نتيجة عن “{query.trim()}”
                  </span>
                  {searchResults.results.teams.length > 0 && (
                    <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f1f5f9]/70">
                      👥 {searchResults.results.teams.length} منتخب
                    </span>
                  )}
                  {searchResults.results.matches.length > 0 && (
                    <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f1f5f9]/70">
                      ⚔️ {searchResults.results.matches.length} مباراة
                    </span>
                  )}
                  {searchResults.results.groups.length > 0 && (
                    <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f1f5f9]/70">
                      🏆 {searchResults.results.groups.length} مجموعة
                    </span>
                  )}
                  {searchResults.results.venues.length > 0 && (
                    <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f1f5f9]/70">
                      🏟️ {searchResults.results.venues.length} ملعب
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f1f5f9]/70">
                    {TEAMS.length} منتخب
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f1f5f9]/70">
                    {GROUPS.length} مجموعة
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-8 relative">
        {/* EMPTY STATE: no query */}
        {!hasQuery && (
          <div className="glass-card rounded-3xl p-10 md:p-14 text-center max-w-2xl mx-auto border border-[#ffd700]/20">
            <div className="text-6xl mb-4 float">⚽</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              ابدأ بكتابة كلمة للبحث
            </h2>
            <p className="text-[#f1f5f9]/70 mb-6 leading-relaxed">
              يمكنك البحث بالعربية أو الإنجليزية، عن أي منتخب، مباراة، ملعب، مدينة، أو مجموعة.
            </p>
            <p className="text-sm text-[#ffd700] mb-4 font-semibold">
              ✨ الآن يدعم البحث الأسماء العربية: "البرازيل"، "فرنسا"، "المغرب"...
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#006233]/40 to-[#006233]/20 border border-[#ffd700]/20 hover:border-[#ffd700]/60 hover:from-[#ffd700]/20 hover:to-[#d01c1f]/10 text-sm text-white transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* NO RESULTS state */}
        {hasQuery && searchResults.total === 0 && (
          <div className="glass-card rounded-3xl p-10 md:p-14 text-center max-w-2xl mx-auto border border-[#d01c1f]/30">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#d01c1f]/20 border border-[#d01c1f]/40 mb-4">
              <span className="text-4xl">😕</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              لا توجد نتائج لـ “{query.trim()}”
            </h2>
            <p className="text-[#f1f5f9]/70 mb-6 leading-relaxed">
              جرّب كلمة أخرى، أو تصفح المحتوى من الروابط أدناه.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/teams" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#006233] to-[#007a40] border border-[#ffd700]/30 text-white font-semibold hover:from-[#007a40] hover:to-[#006233] transition-all">
                كل المنتخبات
              </Link>
              <Link href="/schedule" className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                جدول المباريات
              </Link>
              <Link href="/groups" className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                المجموعات
              </Link>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {hasQuery && searchResults.total > 0 && (
          <div className="space-y-6">
            {/* Filter tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {[
                { key: "all", label: "الكل", icon: "🔎", count: searchResults.total },
                { key: "team", label: "المنتخبات", icon: "👥", count: searchResults.results.teams.length },
                { key: "match", label: "المباريات", icon: "⚔️", count: searchResults.results.matches.length },
                { key: "group", label: "المجموعات", icon: "🏆", count: searchResults.results.groups.length },
                { key: "venue", label: "الملاعب", icon: "🏟️", count: searchResults.results.venues.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 ${
                    activeTab === tab.key
                      ? "bg-[#ffd700] text-[#006233] border-[#ffd700]"
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.key ? "bg-[#006233]/20 text-[#006233]" : "bg-white/10"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Results grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((result, idx) => (
                <SearchResultCard key={`${result.type}-${result.id}-${idx}`} result={result} query={deferredQuery} highlight={highlight} typeLabels={typeLabels} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

// ─── Result Card Component ───────────────────────────────────────────────────
function SearchResultCard({
  result,
  query,
  highlight,
  typeLabels,
}: {
  result: SearchResult;
  query: string;
  highlight: (text: string, q: string) => React.ReactNode;
  typeLabels: Record<string, string>;
}) {
  const meta = (result.meta || {}) as any;
  const standings = meta.standings;
  const match = meta.home ? meta : null; // Match has home/away

  const typeIcon: Record<string, string> = {
    team: "👥",
    match: "⚔️",
    group: "🏆",
    venue: "🏟️",
  };
  const typeColor: Record<string, string> = {
    team: "from-[#006233]/30 to-[#006233]/10 border-[#006233]/40",
    match: "from-[#d01c1f]/30 to-[#d01c1f]/10 border-[#d01c1f]/40",
    group: "from-[#ffd700]/30 to-[#ffd700]/10 border-[#ffd700]/40",
    venue: "from-blue-500/20 to-blue-500/5 border-blue-500/40",
  };

  return (
    <Link
      href={result.href}
      className={`glass-card rounded-2xl p-4 border hover:border-[#ffd700]/60 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] transition-all card-hover block`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border bg-gradient-to-br ${typeColor[result.type]} text-white`}>
          <span>{typeIcon[result.type]}</span>
          <span>{typeLabels[result.type]}</span>
        </span>
        {result.badge && (
          <span className="px-2 py-1 rounded-md bg-[#ffd700]/20 border border-[#ffd700]/40 text-[#ffd700] text-xs font-bold">
            {result.badge}
          </span>
        )}
      </div>

      {/* Title with flag */}
      <div className="flex items-center gap-3 mb-2">
        {result.flag && (
          <div className="text-2xl shrink-0">{result.flag}</div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-base truncate">
            {highlight(result.title, query)}
          </h3>
          {result.titleAr && result.title !== result.titleAr && (
            <p className="text-[#ffd700]/80 text-sm truncate mt-0.5">
              {highlight(result.titleAr, query)}
            </p>
          )}
        </div>
      </div>

      {/* Subtitle */}
      {result.subtitle && (
        <p className="text-[#f1f5f9]/60 text-xs mb-3">
          {highlight(result.subtitle, query)}
        </p>
      )}

      {/* Specific data */}
      {result.type === "team" && standings && (
        <div className="flex items-center justify-between text-[11px] text-[#f1f5f9]/70 border-t border-white/5 pt-3">
          <span>لعب <span className="text-white font-semibold">{standings.played}</span></span>
          <span>ف <span className="text-[#ffd700] font-semibold">{standings.won}</span></span>
          <span>ت <span className="text-white font-semibold">{standings.drawn}</span></span>
          <span>خ <span className="text-[#d01c1f] font-semibold">{standings.lost}</span></span>
          <span className="px-2 py-0.5 rounded-md bg-[#ffd700]/15 border border-[#ffd700]/30 text-[#ffd700] font-bold">
            {standings.points} ن
          </span>
        </div>
      )}

      {result.type === "match" && match && (
        <div className="border-t border-white/5 pt-3 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#f1f5f9]/70">📍 {highlight(match.venue || "—", query)}</span>
            {match.date && (
              <span className="text-[#f1f5f9]/50">{match.date}</span>
            )}
          </div>
          {match.homeScore != null && match.awayScore != null && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-white font-bold">{highlight(match.home, query)}</span>
              <span className="px-2 py-1 rounded-lg bg-black/40 border border-[#ffd700]/30 text-[#ffd700] text-sm font-bold">
                {match.homeScore} - {match.awayScore}
              </span>
              <span className="text-white font-bold">{highlight(match.away, query)}</span>
            </div>
          )}
        </div>
      )}

      {/* Relevance score badge (debug) */}
      <div className="mt-2 text-[10px] text-[#f1f5f9]/30">
        صلة: {result.score}%
      </div>
    </Link>
  );
}
