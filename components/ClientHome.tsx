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

// ترجمة أسماء الفرق للعربية
const TEAM_AR: Record<string, string> = {
  Argentina: "الأرجنتين",
  Austria: "النمسا",
  France: "فرنسا",
  Iraq: "العراق",
  Norway: "النرويج",
  Senegal: "السنغال",
  Algeria: "الجزائر",
  Ghana: "غانا",
  England: "إنجلترا",
  Italy: "إيطاليا",
  Germany: "ألمانيا",
  Portugal: "البرتغال",
  Sweden: "السويد",
  Brazil: "البرازيل",
  Uruguay: "أوروغواي",
  Colombia: "كولومبيا",
  Ecuador: "الإكوادور",
  Mexico: "المكسيك",
  USA: "أمريكا",
  Chile: "تشيلي",
  Canada: "كندا",
  Spain: "إسبانيا",
  Netherlands: "هولندا",
  Belgium: "بلجيكا",
  Croatia: "كرواتيا",
  Denmark: "الدنمارك",
  Serbia: "صربيا",
  Morocco: "المغرب",
  Egypt: "مصر",
  Nigeria: "نيجيريا",
  Japan: "اليابان",
  Australia: "أستراليا",
  "Saudi Arabia": "السعودية",
  "South Korea": "كوريا الجنوبية",
  "Costa Rica": "كوستاريكا",
  Panama: "بنما",
  Peru: "بيرو",
  Iran: "إيران",
  Tunisia: "تونس",
  "Cape Verde": "الرأس الأخضر",
  Turkey: "تركيا",
  Paraguay: "باراغواي",
  Haiti: "هايتي",
  Poland: "بولندا",
  Ukraine: "أوكرانيا",
  Hungary: "المجر",
  Switzerland: "سويسرا",
  Wales: "ويلز",
  "Czech Republic": "التشيك",
  Cameroon: "الكاميرون",
  Mali: "مالي",
  Qatar: "قطر",
  UAE: "الإمارات",
  Jordan: "الأردن",
  Uzbekistan: "أوزبكستان",
  "New Zealand": "نيوزيلندا",
  "Ivory Coast": "ساحل العاج",
  Curaçao: "كوراساو",
};

function teamAr(name: string): string {
  return TEAM_AR[name] || name;
}

// ترجمة تسميات المباريات
function labelAr(state: string, label: string): string {
  if (state === "live") return "مباشر الآن";
  if (state === "ft" || state === "finished") return "انتهت";
  // ترجمة label مثل "Today 21:00 UTC" أو "Tue 18:00 UTC"
  const ar = label
    .replace(/Today/g, "اليوم")
    .replace(/Tue/g, "الثلاثاء")
    .replace(/Wed/g, "الأربعاء")
    .replace(/Thu/g, "الخميس")
    .replace(/Fri/g, "الجمعة")
    .replace(/Sat/g, "السبت")
    .replace(/Sun/g, "الأحد")
    .replace(/Mon/g, "الإثنين")
    .replace(/UTC/g, "ت ع");
  return ar;
}

interface ClientHomeProps {
  matches: Match[];
  articles: Article[];
}

export function ClientHome({ matches, articles }: ClientHomeProps) {
  const liveMatches = matches.filter((m) => m.state === "live");
  const finishedMatches = matches.filter(
    (m) => m.state === "ft" || m.state === "finished"
  );
  const upcomingMatches = matches.filter((m) => m.state === "upcoming");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#006233]/8 via-slate-950 to-slate-950">
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-6 pb-16 relative">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#006233]/15 border border-[#FFD700]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FFD700] live-dot" />
              <span className="text-[#FFD700] text-sm font-bold">كأس العالم 2026</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-3">
              <span className="bg-gradient-to-r from-[#FFD700] via-yellow-200 to-[#FFD700] bg-clip-text text-transparent">
                Mauribin
              </span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              موقعك لأخبار كرة القدم بالعربية — نتائج مباشرة، جداول المباريات، أخبار الانتقالات
            </p>
          </div>

          {/* Featured LIVE Match */}
          {liveMatches.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-600/30">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  مباشر الآن
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-red-500/40 to-transparent" />
              </div>

              {liveMatches[0] && (
                <Link
                  href={`/match/${liveMatches[0]._index}`}
                  className="group relative block rounded-3xl p-6 md:p-10 bg-gradient-to-br from-slate-900/95 to-slate-950 border-2 border-red-500/40 hover:border-red-500/70 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-3xl border-2 border-red-500/30 animate-pulse pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600" />

                  <div className="relative grid grid-cols-3 items-center gap-3 md:gap-8">
                    {/* Home Team */}
                    <div className="text-center min-w-0">
                      <div className="text-6xl md:text-8xl mb-3 group-hover:scale-110 transition-transform duration-500">
                        {liveMatches[0].homeFlag}
                      </div>
                      <div className="text-white font-bold text-sm md:text-xl truncate" dir="rtl">
                        {teamAr(liveMatches[0].home)}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-center">
                      <div className="text-5xl md:text-7xl font-black text-[#FFD700] mb-3 tabular-nums">
                        {liveMatches[0].homeScore ?? 0} : {liveMatches[0].awayScore ?? 0}
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-xs md:text-sm font-bold">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        مباشر
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="text-center min-w-0">
                      <div className="text-6xl md:text-8xl mb-3 group-hover:scale-110 transition-transform duration-500">
                        {liveMatches[0].awayFlag}
                      </div>
                      <div className="text-white font-bold text-sm md:text-xl truncate" dir="rtl">
                        {teamAr(liveMatches[0].away)}
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          )}

          {/* Results */}
          {finishedMatches.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-white">⚽ نتائج مباريات اليوم</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#006233]/40 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {finishedMatches.slice(0, 9).map((match) => (
                  <Link
                    key={match._index}
                    href={`/match/${match._index}`}
                    className="group relative rounded-2xl p-4 bg-slate-900/70 border border-slate-800 hover:border-[#006233]/60 hover:bg-slate-900 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3" dir="rtl">
                      {/* Home */}
                      <div className="flex-1 text-right min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 justify-end">
                          <span className="text-white font-medium text-sm truncate">{teamAr(match.home)}</span>
                          <span className="text-2xl shrink-0">{match.homeFlag}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-white font-medium text-sm truncate">{teamAr(match.away)}</span>
                          <span className="text-2xl shrink-0">{match.awayFlag}</span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-center shrink-0 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-xl md:text-2xl font-black text-white tabular-nums whitespace-nowrap">
                          {match.homeScore ?? "-"} : {match.awayScore ?? "-"}
                        </div>
                        <div className="text-[10px] text-[#FFD700] font-bold mt-0.5">انتهت</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcomingMatches.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-white">📅 مباريات قادمة</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#FFD700]/30 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {upcomingMatches.slice(0, 6).map((match) => (
                  <Link
                    key={match._index}
                    href={`/match/${match._index}`}
                    className="group rounded-2xl p-4 bg-slate-900/70 border border-slate-800 hover:border-[#FFD700]/50 hover:bg-slate-900 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3" dir="rtl">
                      {/* Home */}
                      <div className="flex-1 text-right min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 justify-end">
                          <span className="text-slate-200 font-medium text-sm truncate">{teamAr(match.home)}</span>
                          <span className="text-2xl shrink-0">{match.homeFlag}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-slate-200 font-medium text-sm truncate">{teamAr(match.away)}</span>
                          <span className="text-2xl shrink-0">{match.awayFlag}</span>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="text-center shrink-0 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-xs text-[#FFD700] font-bold mb-0.5">قريباً</div>
                        <div className="text-[10px] text-slate-400 whitespace-nowrap" dir="ltr">
                          {labelAr(match.state, match.label)}
                        </div>
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
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-white">📰 آخر الأخبار</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-700/40 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {articles.slice(0, 6).map((article, i) => (
                  <a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl p-4 bg-slate-900/70 border border-slate-800 hover:border-[#006233]/60 transition-all"
                  >
                    <div className="flex items-start gap-3" dir="rtl">
                      <div className="w-10 h-10 rounded-xl bg-[#006233]/20 flex items-center justify-center text-lg shrink-0">
                        📰
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 text-sm font-medium leading-relaxed group-hover:text-white transition-colors line-clamp-3">
                          {article.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span className="text-[#FFD700]">اقرأ المزيد ←</span>
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl p-6 md:p-8 bg-slate-900/70 border border-slate-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-black text-[#FFD700] mb-1">48</div>
                <div className="text-slate-400 text-xs md:text-sm">منتخب مشارك</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black text-[#FFD700] mb-1">12</div>
                <div className="text-slate-400 text-xs md:text-sm">مجموعة</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black text-[#FFD700] mb-1">104</div>
                <div className="text-slate-400 text-xs md:text-sm">مباراة</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black text-[#FFD700] mb-1">39</div>
                <div className="text-slate-400 text-xs md:text-sm">يوم</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}