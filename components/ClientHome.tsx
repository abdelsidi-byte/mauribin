"use client";
import Link from "next/link";

interface Match {
  _index: number;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  homeScore: number | null;
  awayScore: number | null;
  state: string;
  label: string;
}

interface Article {
  title: string;
  source: string;
  url: string;
}

interface ClientHomeProps {
  matches: Match[];
  articles: Article[];
}

export function ClientHome({ matches, articles }: ClientHomeProps) {
  const liveMatches = matches.filter((m) => m.state === "live");
  const finishedMatches = matches.filter((m) => m.state === "ft");
  const upcomingMatches = matches.filter((m) => m.state === "upcoming");

  return (
    <div className="pitch-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 pt-8 pb-16 relative">
          {/* Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 live-dot" />
              <span className="text-green-400 text-sm font-medium">كأس العالم 2026</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              <span className="gradient-text">Mauribin</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              موقعك لأخبار كرة القدم بالعربية — نتائج مباشرة، جداول المباريات، أخبار الانتقالات
            </p>
          </div>

          {/* Featured LIVE Match - BIG HERO */}
          {liveMatches.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full badge-live text-white text-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-white live-dot" />
                  🔴 مباشر الآن
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent" />
              </div>

              {/* Featured BIG Live Match */}
              {liveMatches[0] && (
                <Link
                  href={`/match/${liveMatches[0]._index}`}
                  className="group relative block glass rounded-3xl p-10 card-hover glow-green overflow-hidden mb-6"
                >
                  <div className="absolute inset-0 rounded-3xl border-2 border-green-500/50 animate-pulse pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500" />
                  
                  <div className="relative flex items-center justify-center gap-8 md:gap-16">
                    {/* Home Team */}
                    <div className="flex-1 text-center">
                      <div className="text-8xl md:text-9xl mb-4 group-hover:scale-110 transition-transform duration-500">
                        {liveMatches[0].homeFlag}
                      </div>
                      <div className="text-white font-bold text-xl md:text-2xl">{liveMatches[0].home}</div>
                    </div>

                    {/* Score */}
                    <div className="text-center flex-shrink-0">
                      <div className="text-7xl md:text-8xl font-black text-green-400 score-animate mb-4">
                        {liveMatches[0].homeScore ?? 0} : {liveMatches[0].awayScore ?? 0}
                      </div>
                      <div className="px-6 py-2 rounded-full badge-live text-white text-sm font-bold">
                        <span className="w-2 h-2 rounded-full bg-white inline-block ml-2 animate-pulse" />
                        مباشر الآن
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 text-center">
                      <div className="text-8xl md:text-9xl mb-4 group-hover:scale-110 transition-transform duration-500">
                        {liveMatches[0].awayFlag}
                      </div>
                      <div className="text-white font-bold text-xl md:text-2xl">{liveMatches[0].away}</div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-green-400/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    اضغط لمتابعة المباراة ←
                  </div>
                </Link>
              )}

              {/* Other Live Matches */}
              {liveMatches.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveMatches.slice(1).map((match) => (
                    <Link
                      key={match._index}
                      href={`/match/${match._index}`}
                      className="group relative glass rounded-2xl p-6 card-hover glow-green overflow-hidden"
                    >
                      <div className="absolute inset-0 rounded-2xl border-2 border-green-500/30 animate-pulse pointer-events-none" />
                      
                      <div className="relative flex items-center justify-between">
                        <div className="flex-1 text-center">
                          <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                            {match.homeFlag}
                          </div>
                          <div className="text-white font-bold text-sm">{match.home}</div>
                        </div>

                        <div className="px-6 text-center">
                          <div className="text-4xl font-black text-green-400 score-animate mb-2">
                            {match.homeScore ?? 0} : {match.awayScore ?? 0}
                          </div>
                          <div className="px-3 py-1 rounded-full badge-live text-white text-xs font-bold">
                            مباشر
                          </div>
                        </div>

                        <div className="flex-1 text-center">
                          <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                            {match.awayFlag}
                          </div>
                          <div className="text-white font-bold text-sm">{match.away}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {finishedMatches.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-white">⚽ نتائج مباريات اليوم</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-600/50 to-transparent" />
              </div>

              <div className="match-grid">
                {finishedMatches.slice(0, 9).map((match) => (
                  <Link
                    key={match._index}
                    href={`/match/${match._index}`}
                    className="group relative glass rounded-2xl p-5 card-hover hover:border-green-500/30"
                  >
                    <div className="absolute top-4 left-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ←
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{match.homeFlag}</span>
                          <span className="text-white font-medium text-sm">{match.home}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{match.awayFlag}</span>
                          <span className="text-white font-medium text-sm">{match.away}</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-3xl font-black text-white mb-1">
                          {match.homeScore ?? "-"} : {match.awayScore ?? "-"}
                        </div>
                        <div className="px-2 py-0.5 rounded-full badge-ft text-white text-xs font-bold">
                          {match.label}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcomingMatches.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-white">📅 مباريات قادمة</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-600/50 to-transparent" />
              </div>

              <div className="match-grid">
                {upcomingMatches.slice(0, 6).map((match) => (
                  <Link
                    key={match._index}
                    href={`/match/${match._index}`}
                    className="group glass rounded-2xl p-5 card-hover hover:border-green-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{match.homeFlag}</span>
                          <span className="text-slate-300 font-medium text-sm">{match.home}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{match.awayFlag}</span>
                          <span className="text-slate-300 font-medium text-sm">{match.away}</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="px-3 py-1 rounded-full badge-upcoming text-white text-xs font-bold mb-1">
                          قريباً
                        </div>
                        <div className="text-slate-500 text-xs">{match.label}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* News */}
          {articles.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-white">📰 آخر الأخبار</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-600/50 to-transparent" />
              </div>

              <div className="mb-6">
                <a
                  href="https://www.bankily.mr/ar/bankily-ar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 rounded-2xl border border-[#ffd700]/20 bg-gradient-to-r from-[#006233] via-[#006233]/95 to-[#D01C1F] hover:scale-[1.01] transition-transform"
                  aria-label="إعلان Bankily"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/20">
                        💳
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#ffd700] font-bold text-lg">Bankily</span>
                        <span className="text-white/80 text-sm">خدمة الدفع الإلكتروني رقم 1 في موريتانيا</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-white/60">صمّام</span>
                          <span className="text-xs text-white/60">•</span>
                          <span className="text-xs text-white/60">آمن</span>
                          <span className="text-xs text-white/60">•</span>
                          <span className="text-xs text-white/60">سريع</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#ffd700] group-hover:translate-x-1 transition-transform">
                      <span className="text-sm font-bold hidden sm:block">ادفع الآن</span>
                      <span>←</span>
                    </div>
                  </div>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.slice(0, 6).map((article, i) => (
                  <a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group glass rounded-2xl p-5 card-hover hover:border-green-500/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-lg shrink-0">
                        📰
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 text-sm font-medium leading-relaxed group-hover:text-green-400 transition-colors line-clamp-3">
                          {article.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-slate-500">{article.source}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-green-500">اقرأ المزيد ←</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-black gradient-text mb-2">48</div>
                <div className="text-slate-400 text-sm">منتخب مشارك</div>
              </div>
              <div>
                <div className="text-4xl font-black gradient-text mb-2">8</div>
                <div className="text-slate-400 text-sm">مجموعات</div>
              </div>
              <div>
                <div className="text-4xl font-black gradient-text mb-2">104</div>
                <div className="text-slate-400 text-sm">مباراة</div>
              </div>
              <div>
                <div className="text-4xl font-black gradient-text mb-2">64</div>
                <div className="text-slate-400 text-sm">يوم كورة</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
