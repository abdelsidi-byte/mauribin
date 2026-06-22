"use client";
import { useEffect, useState } from "react";

interface Match {
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  homeScore: number | null;
  awayScore: number | null;
  state: string;
  label: string;
}

interface Story {
  title: string;
  category: string;
  url: string;
  source?: string;
}

export default function NewsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "live" | "ft" | "upcoming">("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/live-scores");
        const data = await res.json();
        if (data.matches) setMatches(data.matches);
        if (data.stories) setStories(data.stories);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  // Filter to only football/sports related stories
  const sportsStories = stories.filter((s) => {
    const text = `${s.title} ${s.category}`.toLowerCase();
    const sportsKeywords = [
      'world cup', 'مباراة', 'مونديال', 'منتخب', 'فوز', 'هزيمة', 'تعادل',
      'كرة قدم', 'دوري', ' fifa', 'كأس', 'ريال', 'برشلونة', 'ليفربول',
      'الهلال', 'النصر', 'الأهلي', 'الزمالك', 'بطل', 'بطولة', 'لاعب',
      'goal', 'match', 'score', 'tournament', 'team', 'football', 'soccer',
      'المنتخب', 'المنتخبات', 'مباريات', 'فيفا', 'رباعية', 'ثنائية',
    ];
    return sportsKeywords.some((k) => text.includes(k));
  });

  const liveMatches = matches.filter((m) => m.state === "live");
  const ftMatches = matches.filter((m) => m.state === "ft");
  const upcomingMatches = matches.filter((m) => m.state === "upcoming");

  const filteredMatches =
    activeTab === "all"
      ? matches
      : activeTab === "live"
      ? liveMatches
      : activeTab === "ft"
      ? ftMatches
      : upcomingMatches;

  const categoryColors: Record<string, string> = {
    Opinion: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Players: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Analysis: "bg-green-500/20 text-green-300 border-green-500/30",
    News: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  };
  const catColor = (cat: string) => categoryColors[cat] || "bg-slate-500/20 text-slate-300 border-slate-500/30";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-green-500 mb-3">
          📰 Mauribin | موريبين
        </h1>
        <p className="text-xl text-slate-400">أخبار كرة القدم والبطولات العالمية</p>
      </div>

      {/* Tab Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {[
          { key: "all", label: "الكل", icon: "🌐" },
          { key: "live", label: "مباشر", icon: "🔴" },
          { key: "ft", label: "انتهت", icon: "✅" },
          { key: "upcoming", label: "قادمة", icon: "📅" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === tab.key
                ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {tab.icon} {tab.label}
            {tab.key === "live" && liveMatches.length > 0 && (
              <span className="mr-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                {liveMatches.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Matches Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-6 border-r-4 border-green-500 pr-4">
            ⚽ نتائج المباريات
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-xl p-5 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/2 mb-3" />
                  <div className="h-3 bg-slate-700 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatches.map((match, i) => (
                <div
                  key={i}
                  className={`bg-slate-800 rounded-xl p-5 border transition-all hover:scale-[1.02] ${
                    match.state === "live"
                      ? "border-red-500/40 shadow-lg shadow-red-500/10"
                      : "border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{match.homeFlag}</span>
                      <span className="font-bold text-white">{match.home}</span>
                    </div>
                    <span
                      className={`text-2xl font-bold ${
                        match.state === "live" ? "text-green-400" : "text-white"
                      }`}
                    >
                      {match.homeScore ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{match.awayFlag}</span>
                      <span className="font-bold text-white">{match.away}</span>
                    </div>
                    <span
                      className={`text-2xl font-bold ${
                        match.state === "live" ? "text-green-400" : "text-white"
                      }`}
                    >
                      {match.awayScore ?? "—"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {match.state === "live" && (
                      <span className="text-xs font-bold text-red-400 bg-red-500/20 px-2 py-1 rounded animate-pulse">
                        ● مباشر الآن
                      </span>
                    )}
                    {match.state === "upcoming" && (
                      <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                        {match.label}
                      </span>
                    )}
                    {match.state === "ft" && (
                      <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">انتهت</span>
                    )}
                    <span className="text-xs text-slate-500">كأس العالم 2026</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-12 bg-slate-800 rounded-xl">
              <p className="text-lg">⚽ لا توجد مباريات</p>
            </div>
          )}
        </div>

        {/* Top Stories Sidebar */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 border-r-4 border-orange-500 pr-4">
            🔥 أبرز الأخبار
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-xl p-4 animate-pulse">
                  <div className="h-3 bg-slate-700 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-slate-700 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : sportsStories.length > 0 ? (
            <div className="space-y-4">
              {sportsStories.map((story, i) => (
                <a
                  key={i}
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all group"
                >
                  <div className="mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${catColor(story.category)}`}>
                      {story.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-3 text-sm leading-relaxed">
                    {story.title}
                  </h3>
                  <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                    <span>{story.source || "BBC العربية"}</span>
                    <span>↗</span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-8 bg-slate-800 rounded-xl">
              <p>📰 لا توجد أخبار حالياً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
